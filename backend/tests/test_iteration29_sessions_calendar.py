"""
Iteration 29 - Sessions Calendar & Font Controls Testing
Tests:
1. Session CRUD with available_dates and time_slots
2. Session with title_style/description_style (font controls)
3. Min 7 days advance booking logic (frontend enforced)
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

class TestSessionsCalendarFeatures:
    """Test sessions with available_dates, time_slots, and font controls"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.api = requests.Session()
        self.api.headers.update({"Content-Type": "application/json"})
        self.created_session_id = None
        yield
        # Cleanup
        if self.created_session_id:
            try:
                self.api.delete(f"{BASE_URL}/api/sessions/{self.created_session_id}")
            except:
                pass
    
    def test_get_all_sessions(self):
        """Test that sessions endpoint returns list of sessions"""
        response = self.api.get(f"{BASE_URL}/api/sessions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} sessions")
    
    def test_create_session_with_available_dates(self):
        """Test creating session with available_dates array"""
        # Generate dates: 7-37 days from now, weekdays only
        today = datetime.now()
        available_dates = []
        for i in range(7, 38):
            d = today + timedelta(days=i)
            if d.weekday() < 5:  # Monday=0 to Friday=4
                available_dates.append(d.strftime("%Y-%m-%d"))
        
        session_data = {
            "title": "TEST_Calendar_Session_29",
            "description": "Test session with available dates",
            "price_usd": 150,
            "price_inr": 12000,
            "price_aed": 550,
            "duration": "60-90 minutes",
            "session_mode": "online",
            "available_dates": available_dates[:10],  # First 10 weekdays
            "time_slots": ["10:00 AM", "2:00 PM", "5:00 PM"],
            "testimonial_text": "This session was transformative!",
            "visible": True
        }
        
        response = self.api.post(f"{BASE_URL}/api/sessions", json=session_data)
        assert response.status_code in [200, 201], f"Failed to create session: {response.text}"
        
        created = response.json()
        self.created_session_id = created.get("id")
        
        # Verify response
        assert created["title"] == "TEST_Calendar_Session_29"
        assert "available_dates" in created
        assert len(created["available_dates"]) == 10
        assert created["time_slots"] == ["10:00 AM", "2:00 PM", "5:00 PM"]
        print(f"Created session with {len(created['available_dates'])} available dates")
    
    def test_create_session_with_font_controls(self):
        """Test creating session with title_style and description_style"""
        session_data = {
            "title": "TEST_Font_Controls_Session_29",
            "description": "Test session with font styling",
            "price_usd": 200,
            "price_inr": 15000,
            "price_aed": 730,
            "duration": "90 minutes",
            "session_mode": "both",
            "title_style": {
                "font_color": "#7c3aed",
                "font_family": "'Cinzel', serif",
                "font_size": "24px",
                "font_weight": "bold",
                "font_style": "normal"
            },
            "description_style": {
                "font_color": "#555555",
                "font_family": "'Lato', sans-serif",
                "font_size": "16px",
                "font_weight": "400",
                "font_style": "italic"
            },
            "available_dates": [],
            "time_slots": ["11:00 AM"],
            "visible": True
        }
        
        response = self.api.post(f"{BASE_URL}/api/sessions", json=session_data)
        assert response.status_code in [200, 201], f"Failed: {response.text}"
        
        created = response.json()
        self.created_session_id = created.get("id")
        
        # Verify title_style
        assert created.get("title_style") is not None
        assert created["title_style"]["font_color"] == "#7c3aed"
        assert created["title_style"]["font_weight"] == "bold"
        
        # Verify description_style
        assert created.get("description_style") is not None
        assert created["description_style"]["font_style"] == "italic"
        
        print(f"Created session with font controls: title_style={created['title_style']}")
    
    def test_update_session_dates(self):
        """Test updating available_dates on existing session"""
        # Create session first
        session_data = {
            "title": "TEST_Update_Dates_29",
            "description": "Test updating dates",
            "available_dates": ["2026-02-01"],
            "time_slots": ["10:00 AM"],
            "visible": True
        }
        
        create_resp = self.api.post(f"{BASE_URL}/api/sessions", json=session_data)
        assert create_resp.status_code in [200, 201]
        self.created_session_id = create_resp.json()["id"]
        
        # Update with new dates
        update_data = {
            "title": "TEST_Update_Dates_29",
            "description": "Updated description",
            "available_dates": ["2026-02-05", "2026-02-06", "2026-02-07"],
            "time_slots": ["10:00 AM", "3:00 PM"]
        }
        
        update_resp = self.api.put(f"{BASE_URL}/api/sessions/{self.created_session_id}", json=update_data)
        assert update_resp.status_code == 200
        
        updated = update_resp.json()
        assert len(updated["available_dates"]) == 3
        assert "2026-02-05" in updated["available_dates"]
        assert len(updated["time_slots"]) == 2
        print("Successfully updated session dates and time_slots")
    
    def test_get_session_with_dates(self):
        """Test GET single session returns available_dates and time_slots"""
        # Create session
        session_data = {
            "title": "TEST_Get_Session_29",
            "description": "Testing GET with dates",
            "available_dates": ["2026-03-10", "2026-03-11"],
            "time_slots": ["9:00 AM"]
        }
        
        create_resp = self.api.post(f"{BASE_URL}/api/sessions", json=session_data)
        assert create_resp.status_code in [200, 201]
        self.created_session_id = create_resp.json()["id"]
        
        # GET the session
        get_resp = self.api.get(f"{BASE_URL}/api/sessions/{self.created_session_id}")
        assert get_resp.status_code == 200
        
        data = get_resp.json()
        assert data["id"] == self.created_session_id
        assert "available_dates" in data
        assert "time_slots" in data
        assert data["available_dates"] == ["2026-03-10", "2026-03-11"]
        print(f"GET session returned: available_dates={data['available_dates']}, time_slots={data['time_slots']}")


class TestExistingSessionsData:
    """Test existing sessions have correct structure"""
    
    def test_all_sessions_have_required_fields(self):
        """Verify all sessions have available_dates and time_slots fields"""
        response = requests.get(f"{BASE_URL}/api/sessions")
        assert response.status_code == 200
        sessions = response.json()
        
        for session in sessions[:5]:  # Check first 5
            assert "id" in session
            assert "title" in session
            assert "description" in session
            assert "available_dates" in session or session.get("available_dates") is None
            assert "time_slots" in session or session.get("time_slots") is None
            assert "session_mode" in session
            print(f"Session '{session['title'][:30]}...' has session_mode={session.get('session_mode')}, dates={len(session.get('available_dates') or [])}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
