"""
Iteration 12 - Cart System Backend Tests
Tests for the new cart functionality including:
- Cart context API validation
- Promotion validation endpoint
- Enrollment flow with cart checkout
- Multi-program multi-participant enrollment
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPromotionValidation:
    """Test promo code validation for cart checkout"""
    
    def test_validate_percentage_promo_ny2026(self):
        """Test NY2026 promo code returns 15% discount"""
        response = requests.post(f"{BASE_URL}/api/promotions/validate", json={
            "code": "NY2026",
            "currency": "usd"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["code"] == "NY2026"
        assert data["discount_type"] == "percentage"
        assert data["discount_percentage"] == 15.0
        print(f"PASS: NY2026 promo - 15% discount validated")
    
    def test_validate_fixed_promo_early50(self):
        """Test EARLY50 promo code returns fixed discount"""
        response = requests.post(f"{BASE_URL}/api/promotions/validate", json={
            "code": "EARLY50",
            "currency": "usd"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["code"] == "EARLY50"
        assert data["discount_type"] == "fixed"
        print(f"PASS: EARLY50 promo - fixed discount validated")
    
    def test_invalid_promo_code(self):
        """Test invalid promo code returns 404"""
        response = requests.post(f"{BASE_URL}/api/promotions/validate", json={
            "code": "INVALIDCODE123",
            "currency": "usd"
        })
        assert response.status_code == 404
        print(f"PASS: Invalid promo code returns 404")


class TestProgramsAPI:
    """Test programs API for cart display"""
    
    def test_get_programs_list(self):
        """Test GET /api/programs returns programs with duration_tiers"""
        response = requests.get(f"{BASE_URL}/api/programs?visible_only=true")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        
        # Check first program has expected structure
        program = data[0]
        assert "id" in program
        assert "title" in program
        assert "image" in program
        assert "is_flagship" in program
        assert "duration_tiers" in program
        
        # Validate duration_tiers structure
        if program.get("is_flagship") and program.get("duration_tiers"):
            tier = program["duration_tiers"][0]
            assert "label" in tier
            assert "price_usd" in tier
            assert "price_aed" in tier
        
        print(f"PASS: Programs API returns {len(data)} programs with duration_tiers")
    
    def test_get_single_program(self):
        """Test GET /api/programs/{id} returns program details"""
        response = requests.get(f"{BASE_URL}/api/programs/1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "1"
        assert "title" in data
        assert "duration_tiers" in data
        print(f"PASS: Single program API returns: {data['title']}")
    
    def test_get_upcoming_programs(self):
        """Test GET /api/programs with upcoming_only filter"""
        response = requests.get(f"{BASE_URL}/api/programs?visible_only=true&upcoming_only=true")
        assert response.status_code == 200
        data = response.json()
        # Should have upcoming programs if is_upcoming flag is set
        for program in data:
            assert program.get("is_upcoming") == True or program.get("start_date") is not None
        print(f"PASS: Upcoming programs filter returns {len(data)} programs")


class TestEnrollmentStart:
    """Test enrollment start API for cart checkout flow"""
    
    def test_start_enrollment_single_participant(self):
        """Test POST /api/enrollment/start with single participant"""
        payload = {
            "booker_name": "Test Booker",
            "booker_email": "test@example.com",
            "booker_country": "US",
            "participants": [
                {
                    "name": "Test Participant",
                    "relationship": "Myself",
                    "age": 30,
                    "gender": "Male",
                    "country": "US",
                    "attendance_mode": "online",
                    "notify": False,
                    "email": None,
                    "phone": None
                }
            ]
        }
        response = requests.post(f"{BASE_URL}/api/enrollment/start", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "enrollment_id" in data
        assert data["enrollment_id"] is not None
        print(f"PASS: Enrollment started with ID: {data['enrollment_id']}")
        return data["enrollment_id"]
    
    def test_start_enrollment_multiple_participants(self):
        """Test enrollment with multiple participants (cart scenario)"""
        payload = {
            "booker_name": "Multi Cart Booker",
            "booker_email": "multicart@example.com",
            "booker_country": "AE",
            "participants": [
                {
                    "name": "Participant One",
                    "relationship": "Myself",
                    "age": 35,
                    "gender": "Female",
                    "country": "AE",
                    "attendance_mode": "online",
                    "notify": False,
                    "email": None,
                    "phone": None,
                    "program_id": "1",
                    "program_title": "Program A"
                },
                {
                    "name": "Participant Two",
                    "relationship": "Spouse",
                    "age": 32,
                    "gender": "Male",
                    "country": "AE",
                    "attendance_mode": "offline",
                    "notify": False,
                    "email": None,
                    "phone": None,
                    "program_id": "2",
                    "program_title": "Program B"
                }
            ]
        }
        response = requests.post(f"{BASE_URL}/api/enrollment/start", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "enrollment_id" in data
        print(f"PASS: Multi-participant enrollment started: {data['enrollment_id']}")
        return data["enrollment_id"]


class TestOTPFlow:
    """Test OTP flow for enrollment (MOCKED)"""
    
    def test_send_otp(self):
        """Test sending OTP for phone verification"""
        # First start an enrollment
        enrollment_payload = {
            "booker_name": "OTP Test User",
            "booker_email": "otptest@example.com",
            "booker_country": "US",
            "participants": [{
                "name": "OTP Participant",
                "relationship": "Myself",
                "age": 25,
                "gender": "Female",
                "country": "US",
                "attendance_mode": "online"
            }]
        }
        enrollment_res = requests.post(f"{BASE_URL}/api/enrollment/start", json=enrollment_payload)
        assert enrollment_res.status_code == 200
        enrollment_id = enrollment_res.json()["enrollment_id"]
        
        # Send OTP
        otp_payload = {
            "phone": "5551234567",
            "country_code": "+1"
        }
        response = requests.post(f"{BASE_URL}/api/enrollment/{enrollment_id}/send-otp", json=otp_payload)
        assert response.status_code == 200
        data = response.json()
        
        # Check mock OTP is returned (for testing)
        assert "mock_otp" in data or "message" in data
        if "mock_otp" in data:
            print(f"PASS: Mock OTP sent: {data['mock_otp']}")
        else:
            print(f"PASS: OTP sent successfully")
    
    def test_verify_otp_mocked(self):
        """Test OTP verification with mock OTP"""
        # Start enrollment
        enrollment_payload = {
            "booker_name": "OTP Verify Test",
            "booker_email": "otpverify@example.com",
            "booker_country": "US",
            "participants": [{
                "name": "Verify Participant",
                "relationship": "Myself",
                "age": 28,
                "gender": "Male",
                "country": "US",
                "attendance_mode": "online"
            }]
        }
        enrollment_res = requests.post(f"{BASE_URL}/api/enrollment/start", json=enrollment_payload)
        enrollment_id = enrollment_res.json()["enrollment_id"]
        
        # Send OTP
        otp_payload = {"phone": "5559876543", "country_code": "+1"}
        otp_res = requests.post(f"{BASE_URL}/api/enrollment/{enrollment_id}/send-otp", json=otp_payload)
        mock_otp = otp_res.json().get("mock_otp", "123456")
        
        # Verify OTP
        verify_payload = {
            "phone": "5559876543",
            "country_code": "+1",
            "otp": mock_otp
        }
        response = requests.post(f"{BASE_URL}/api/enrollment/{enrollment_id}/verify-otp", json=verify_payload)
        assert response.status_code == 200
        print(f"PASS: OTP verified successfully")


class TestCurrencyDetection:
    """Test currency detection for cart pricing"""
    
    def test_detect_currency(self):
        """Test GET /api/currency/detect returns user's currency"""
        response = requests.get(f"{BASE_URL}/api/currency/detect")
        assert response.status_code == 200
        data = response.json()
        assert "currency" in data
        assert "symbol" in data
        assert "country" in data
        print(f"PASS: Currency detected: {data['currency'].upper()} ({data['symbol']}) for {data['country']}")
    
    def test_exchange_rates(self):
        """Test GET /api/currency/exchange-rates returns rates"""
        response = requests.get(f"{BASE_URL}/api/currency/exchange-rates")
        assert response.status_code == 200
        data = response.json()
        assert "base" in data
        assert "rates" in data
        assert len(data["rates"]) > 0
        print(f"PASS: Exchange rates returned with {len(data['rates'])} currencies")


class TestCartCheckoutPrep:
    """Test checkout preparation endpoints"""
    
    def test_health_check(self):
        """Basic health check"""
        response = requests.get(f"{BASE_URL}/api")
        assert response.status_code == 200
        print("PASS: API health check passed")
    
    def test_settings_endpoint(self):
        """Test settings endpoint for header/footer data"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        print("PASS: Settings endpoint accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
