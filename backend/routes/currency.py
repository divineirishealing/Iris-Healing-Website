from fastapi import APIRouter, Request
from models import CurrencyInfo

router = APIRouter(prefix="/api/currency", tags=["Currency"])

# Currency mapping based on country codes
CURRENCY_MAP = {
    "US": {"currency": "usd", "symbol": "$", "country": "United States"},
    "IN": {"currency": "inr", "symbol": "₹", "country": "India"},
    "GB": {"currency": "gbp", "symbol": "£", "country": "United Kingdom"},
    "EU": {"currency": "eur", "symbol": "€", "country": "Europe"},
    "DE": {"currency": "eur", "symbol": "€", "country": "Germany"},
    "FR": {"currency": "eur", "symbol": "€", "country": "France"},
    "IT": {"currency": "eur", "symbol": "€", "country": "Italy"},
    "ES": {"currency": "eur", "symbol": "€", "country": "Spain"},
    "NL": {"currency": "eur", "symbol": "€", "country": "Netherlands"},
}

@router.get("/detect", response_model=CurrencyInfo)
async def detect_currency(request: Request, country_code: str = None):
    """Detect currency based on country code or IP"""
    
    # If country code provided, use it
    if country_code and country_code.upper() in CURRENCY_MAP:
        info = CURRENCY_MAP[country_code.upper()]
        return CurrencyInfo(**info)
    
    # Try to detect from headers (CloudFlare provides this)
    cf_country = request.headers.get("CF-IPCountry", "US")
    
    if cf_country in CURRENCY_MAP:
        info = CURRENCY_MAP[cf_country]
    else:
        # Default to USD
        info = CURRENCY_MAP["US"]
    
    return CurrencyInfo(**info)

@router.get("/supported")
async def get_supported_currencies():
    """Get list of all supported currencies"""
    return {
        "currencies": [
            {"code": "usd", "symbol": "$", "name": "US Dollar"},
            {"code": "inr", "symbol": "₹", "name": "Indian Rupee"},
            {"code": "eur", "symbol": "€", "name": "Euro"},
            {"code": "gbp", "symbol": "£", "name": "British Pound"}
        ]
    }
