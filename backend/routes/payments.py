from fastapi import APIRouter, HTTPException, Request, Header
from models import PaymentTransaction, PaymentTransactionCreate, CheckoutRequest
from typing import List, Optional
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/payments", tags=["Payments"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

@router.post("/checkout")
async def create_checkout(checkout_req: CheckoutRequest, request: Request):
    """Create a Stripe checkout session for program or session purchase"""
    
    # Get item details and price based on currency
    if checkout_req.item_type == "program":
        item = await db.programs.find_one({"id": checkout_req.item_id})
        if not item:
            raise HTTPException(status_code=404, detail="Program not found")
    elif checkout_req.item_type == "session":
        item = await db.sessions.find_one({"id": checkout_req.item_id})
        if not item:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        raise HTTPException(status_code=400, detail="Invalid item type")
    
    # Get price based on currency (SERVER-SIDE ONLY - SECURITY)
    currency_lower = checkout_req.currency.lower()
    price_field = f"price_{currency_lower}"
    amount = item.get(price_field, item.get("price_usd", 0.0))
    
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid price for selected currency")
    
    # Initialize Stripe
    host_url = checkout_req.origin_url
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Create checkout session
    success_url = f"{host_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/payment/cancel"
    
    metadata = {
        "item_type": checkout_req.item_type,
        "item_id": checkout_req.item_id,
        "item_title": item["title"],
        "customer_email": checkout_req.customer_email,
        "customer_name": checkout_req.customer_name or ""
    }
    
    checkout_request = CheckoutSessionRequest(
        amount=float(amount),
        currency=currency_lower,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = PaymentTransactionCreate(
        session_id=session.session_id,
        customer_email=checkout_req.customer_email,
        customer_name=checkout_req.customer_name,
        item_type=checkout_req.item_type,
        item_id=checkout_req.item_id,
        item_title=item["title"],
        amount=amount,
        currency=currency_lower,
        metadata=metadata
    )
    
    transaction_obj = PaymentTransaction(**transaction.dict())
    await db.payment_transactions.insert_one(transaction_obj.dict())
    
    return {"url": session.url, "session_id": session.session_id}

@router.get("/status/{session_id}")
async def get_payment_status(session_id: str, request: Request):
    """Get payment status for a checkout session"""
    
    # Check database first
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # If already paid, return immediately
    if transaction["payment_status"] == "paid":
        return PaymentTransaction(**transaction)
    
    # Otherwise, check with Stripe
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction if payment succeeded
        if status.payment_status == "paid" and transaction["payment_status"] != "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "payment_status": "paid",
                    "stripe_payment_intent": status.metadata.get("payment_intent"),
                    "updated_at": datetime.utcnow()
                }}
            )
            transaction["payment_status"] = "paid"
        
        return PaymentTransaction(**transaction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions", response_model=List[PaymentTransaction])
async def get_all_transactions():
    """Get all payment transactions (admin only)"""
    transactions = await db.payment_transactions.find().sort("created_at", -1).to_list(1000)
    return [PaymentTransaction(**t) for t in transactions]

@router.get("/transactions/stats")
async def get_transaction_stats():
    """Get transaction statistics for admin dashboard"""
    
    # Total revenue
    pipeline = [
        {"$match": {"payment_status": "paid"}},
        {"$group": {
            "_id": None,
            "total_revenue": {"$sum": "$amount"},
            "total_sales": {"$sum": 1}
        }}
    ]
    
    result = await db.payment_transactions.aggregate(pipeline).to_list(1)
    
    if result:
        stats = result[0]
        return {
            "total_revenue": round(stats["total_revenue"], 2),
            "total_sales": stats["total_sales"]
        }
    
    return {"total_revenue": 0, "total_sales": 0}
