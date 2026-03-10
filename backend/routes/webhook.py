from fastapi import APIRouter, Request, HTTPException
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from emergentintegrations.payments.stripe.checkout import StripeCheckout
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/webhook", tags=["Webhooks"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

@router.post("/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    if not signature:
        raise HTTPException(status_code=400, detail="No signature header")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
        
        # Handle payment success
        if event.event_type == "checkout.session.completed":
            session_id = event.session_id
            
            # Update transaction status
            await db.payment_transactions.update_one(
                {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                {"$set": {
                    "payment_status": "paid",
                    "stripe_payment_intent": event.metadata.get("payment_intent"),
                    "updated_at": datetime.utcnow()
                }}
            )
        
        return {"status": "success", "event": event.event_type}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
