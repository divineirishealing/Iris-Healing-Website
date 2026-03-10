from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict
from datetime import datetime
import uuid

# Existing models
class Program(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    description: str
    image: str
    link: str = "/program"
    price_usd: float = 0.0
    price_inr: float = 0.0
    price_eur: float = 0.0
    price_gbp: float = 0.0
    duration: str = "90 days"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProgramCreate(BaseModel):
    title: str
    category: str
    description: str
    image: str
    link: Optional[str] = "/program"
    price_usd: float = 0.0
    price_inr: float = 0.0
    price_eur: float = 0.0
    price_gbp: float = 0.0
    duration: Optional[str] = "90 days"

class Session(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    price_usd: float = 0.0
    price_inr: float = 0.0
    price_eur: float = 0.0
    price_gbp: float = 0.0
    duration: str = "60-90 minutes"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SessionCreate(BaseModel):
    title: str
    description: str
    image: str
    price_usd: float = 0.0
    price_inr: float = 0.0
    price_eur: float = 0.0
    price_gbp: float = 0.0
    duration: Optional[str] = "60-90 minutes"

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    videoId: str
    thumbnail: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    videoId: str
    thumbnail: Optional[str] = ""

class Stat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    value: str
    label: str
    order: int = 0

class StatCreate(BaseModel):
    value: str
    label: str
    order: Optional[int] = 0

class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)

class NewsletterCreate(BaseModel):
    email: str

# Payment Transaction Model
class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    customer_email: EmailStr
    customer_name: Optional[str] = None
    item_type: str  # 'program' or 'session'
    item_id: str
    item_title: str
    amount: float
    currency: str
    payment_status: str = "pending"  # pending, paid, failed, refunded
    stripe_payment_intent: Optional[str] = None
    metadata: Optional[Dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentTransactionCreate(BaseModel):
    session_id: str
    customer_email: EmailStr
    customer_name: Optional[str] = None
    item_type: str
    item_id: str
    item_title: str
    amount: float
    currency: str
    metadata: Optional[Dict] = None

# Checkout Request
class CheckoutRequest(BaseModel):
    item_type: str  # 'program' or 'session'
    item_id: str
    currency: str = "usd"
    customer_email: EmailStr
    customer_name: Optional[str] = None
    origin_url: str

# Currency Detection
class CurrencyInfo(BaseModel):
    currency: str
    symbol: str
    country: str
