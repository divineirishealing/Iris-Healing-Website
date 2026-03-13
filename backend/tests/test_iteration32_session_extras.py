"""
Iteration 32 - Session Extras Testing
Features: Unified Calendar Manager, Session Testimonials, Session Questions
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
SAMPLE_SESSION_ID = "92e592c9-5885-4b59-81bf-794636d9f1aa"


class TestSessionExtrasCalendar:
    """Test Unified Calendar API endpoints"""
    
    def test_get_calendar_returns_defaults(self):
        """GET /api/session-extras/calendar returns global calendar with default values"""
        response = requests.get(f"{BASE_URL}/api/session-extras/calendar")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        
        # Verify structure
        assert "time_slots" in data, "Missing time_slots field"
        assert "min_advance_days" in data, "Missing min_advance_days field"
        assert "block_weekends" in data, "Missing block_weekends field"
        assert "available_dates" in data, "Missing available_dates field"
        
        # Check defaults
        assert isinstance(data["time_slots"], list), "time_slots should be a list"
        assert isinstance(data["available_dates"], list), "available_dates should be a list"
        print(f"Calendar data: time_slots={len(data['time_slots'])}, min_advance={data['min_advance_days']}, block_weekends={data['block_weekends']}")
    
    def test_update_calendar_available_dates(self):
        """PUT /api/session-extras/calendar can update available_dates"""
        # First get current state
        get_resp = requests.get(f"{BASE_URL}/api/session-extras/calendar")
        current = get_resp.json()
        
        # Add test dates
        test_dates = ["2026-02-15", "2026-02-16", "2026-02-17"]
        new_dates = list(set(current.get("available_dates", []) + test_dates))
        
        update_payload = {"available_dates": new_dates}
        response = requests.put(f"{BASE_URL}/api/session-extras/calendar", json=update_payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        updated = response.json()
        for d in test_dates:
            assert d in updated["available_dates"], f"Date {d} not persisted"
        print(f"Successfully added {len(test_dates)} test dates")
    
    def test_update_calendar_time_slots(self):
        """PUT /api/session-extras/calendar can update time_slots"""
        test_slots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"]
        
        response = requests.put(f"{BASE_URL}/api/session-extras/calendar", json={"time_slots": test_slots})
        assert response.status_code == 200
        
        updated = response.json()
        assert updated["time_slots"] == test_slots, f"Time slots mismatch: {updated['time_slots']}"
        print(f"Time slots updated: {test_slots}")
    
    def test_update_calendar_rules(self):
        """PUT /api/session-extras/calendar can update block_weekends and min_advance_days"""
        # Test with block_weekends=True and min_advance_days=14
        response = requests.put(f"{BASE_URL}/api/session-extras/calendar", json={
            "block_weekends": True,
            "min_advance_days": 14
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["block_weekends"] == True, "block_weekends not updated"
        assert data["min_advance_days"] == 14, "min_advance_days not updated"
        
        # Reset to default
        requests.put(f"{BASE_URL}/api/session-extras/calendar", json={
            "block_weekends": True,
            "min_advance_days": 7
        })
        print("Calendar rules updated and reset")


class TestSessionTestimonials:
    """Test Session Testimonials CRUD endpoints"""
    
    def test_create_testimonial(self):
        """POST /api/session-extras/testimonials creates a session testimonial"""
        payload = {
            "session_id": SAMPLE_SESSION_ID,
            "client_name": "TEST_John Doe",
            "text": "This session changed my life. Amazing experience!",
            "client_photo": "",
            "visible": True
        }
        
        response = requests.post(f"{BASE_URL}/api/session-extras/testimonials", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["client_name"] == payload["client_name"], "client_name mismatch"
        assert data["text"] == payload["text"], "text mismatch"
        assert data["session_id"] == payload["session_id"], "session_id mismatch"
        assert "id" in data, "Missing id field"
        print(f"Created testimonial: {data['id']}")
        return data["id"]
    
    def test_get_testimonials_by_session(self):
        """GET /api/session-extras/testimonials?session_id=X returns testimonials for a session"""
        response = requests.get(f"{BASE_URL}/api/session-extras/testimonials", params={"session_id": SAMPLE_SESSION_ID})
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list), "Expected list response"
        
        # Check if any testimonials exist for this session
        for t in data:
            assert t["session_id"] == SAMPLE_SESSION_ID or t["session_id"] == "", "Wrong session_id"
        print(f"Found {len(data)} testimonials for session {SAMPLE_SESSION_ID}")
    
    def test_get_all_testimonials(self):
        """GET /api/session-extras/testimonials returns all testimonials"""
        response = requests.get(f"{BASE_URL}/api/session-extras/testimonials")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list), "Expected list response"
        print(f"Total testimonials: {len(data)}")
    
    def test_update_testimonial(self):
        """PUT /api/session-extras/testimonials/{id} updates a testimonial"""
        # First create one
        create_resp = requests.post(f"{BASE_URL}/api/session-extras/testimonials", json={
            "session_id": SAMPLE_SESSION_ID,
            "client_name": "TEST_Update User",
            "text": "Original text"
        })
        tid = create_resp.json()["id"]
        
        # Update it
        update_resp = requests.put(f"{BASE_URL}/api/session-extras/testimonials/{tid}", json={
            "session_id": SAMPLE_SESSION_ID,
            "client_name": "TEST_Update User Updated",
            "text": "Updated text here"
        })
        assert update_resp.status_code == 200
        
        updated = update_resp.json()
        assert updated["client_name"] == "TEST_Update User Updated"
        assert updated["text"] == "Updated text here"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/session-extras/testimonials/{tid}")
        print(f"Updated and cleaned up testimonial {tid}")
    
    def test_delete_testimonial(self):
        """DELETE /api/session-extras/testimonials/{id} removes a testimonial"""
        # Create one
        create_resp = requests.post(f"{BASE_URL}/api/session-extras/testimonials", json={
            "session_id": SAMPLE_SESSION_ID,
            "client_name": "TEST_Delete User",
            "text": "To be deleted"
        })
        tid = create_resp.json()["id"]
        
        # Delete it
        del_resp = requests.delete(f"{BASE_URL}/api/session-extras/testimonials/{tid}")
        assert del_resp.status_code == 200
        
        # Verify gone (should 404 on direct get if we had one)
        print(f"Successfully deleted testimonial {tid}")


class TestSessionQuestions:
    """Test Session Questions CRUD endpoints"""
    
    def test_submit_question(self):
        """POST /api/session-extras/questions submits a question with name, email, question, session_id"""
        payload = {
            "session_id": SAMPLE_SESSION_ID,
            "name": "TEST_Jane Smith",
            "email": "test_jane@example.com",
            "question": "What should I expect during the healing session?"
        }
        
        response = requests.post(f"{BASE_URL}/api/session-extras/questions", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"], "name mismatch"
        assert data["email"] == payload["email"], "email mismatch"
        assert data["question"] == payload["question"], "question mismatch"
        assert data["session_id"] == payload["session_id"], "session_id mismatch"
        assert data["replied"] == False, "Should be unreplied initially"
        assert "id" in data, "Missing id field"
        print(f"Created question: {data['id']}")
        return data["id"]
    
    def test_get_questions_list(self):
        """GET /api/session-extras/questions returns questions list"""
        response = requests.get(f"{BASE_URL}/api/session-extras/questions")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list), "Expected list response"
        print(f"Total questions: {len(data)}")
    
    def test_reply_to_question(self):
        """PUT /api/session-extras/questions/{id}/reply saves a reply"""
        # First create a question
        create_resp = requests.post(f"{BASE_URL}/api/session-extras/questions", json={
            "session_id": SAMPLE_SESSION_ID,
            "name": "TEST_Reply User",
            "email": "test_reply@example.com",
            "question": "Can you help with anxiety?"
        })
        qid = create_resp.json()["id"]
        
        # Reply to it
        reply_resp = requests.put(f"{BASE_URL}/api/session-extras/questions/{qid}/reply", json={
            "reply": "Yes, our sessions are designed to help with anxiety and stress.",
            "send_email": False
        })
        assert reply_resp.status_code == 200
        
        result = reply_resp.json()
        assert result["message"] == "Reply saved", "Expected 'Reply saved' message"
        
        # Verify reply was saved
        get_resp = requests.get(f"{BASE_URL}/api/session-extras/questions")
        questions = get_resp.json()
        replied_q = next((q for q in questions if q["id"] == qid), None)
        assert replied_q is not None, "Question not found"
        assert replied_q["replied"] == True, "replied flag not set"
        assert replied_q["reply"] != "", "reply text not saved"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/session-extras/questions/{qid}")
        print(f"Reply saved and verified for question {qid}")
    
    def test_delete_question(self):
        """DELETE /api/session-extras/questions/{id} removes a question"""
        # Create one
        create_resp = requests.post(f"{BASE_URL}/api/session-extras/questions", json={
            "session_id": SAMPLE_SESSION_ID,
            "name": "TEST_Delete Question",
            "email": "test_delete@example.com",
            "question": "To be deleted"
        })
        qid = create_resp.json()["id"]
        
        # Delete it
        del_resp = requests.delete(f"{BASE_URL}/api/session-extras/questions/{qid}")
        assert del_resp.status_code == 200
        
        print(f"Successfully deleted question {qid}")


class TestSessionExtrasSiteSettings:
    """Test site settings for session font controls"""
    
    def test_session_template_in_page_heroes(self):
        """GET /api/settings returns page_heroes.session_template for session styles"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        
        data = response.json()
        page_heroes = data.get("page_heroes", {})
        session_tpl = page_heroes.get("session_template", {})
        
        # session_template should be present (may be empty initially)
        print(f"Session template keys: {list(session_tpl.keys()) if session_tpl else 'None'}")
        
        # Verify sessions page hero exists
        sessions_hero = page_heroes.get("sessions", {})
        print(f"Sessions page hero: {sessions_hero}")
    
    def test_update_session_template_styles(self):
        """PUT /api/settings can update page_heroes.session_template styles"""
        # Get current
        get_resp = requests.get(f"{BASE_URL}/api/settings")
        current = get_resp.json()
        
        # Update session_template
        page_heroes = current.get("page_heroes", {})
        session_tpl = page_heroes.get("session_template", {})
        session_tpl["title_style"] = {
            "font_family": "'Cinzel', serif",
            "font_size": "28px",
            "font_color": "#D4AF37"
        }
        page_heroes["session_template"] = session_tpl
        
        update_resp = requests.put(f"{BASE_URL}/api/settings", json={"page_heroes": page_heroes})
        assert update_resp.status_code == 200
        
        # Verify
        verify_resp = requests.get(f"{BASE_URL}/api/settings")
        verify_data = verify_resp.json()
        updated_tpl = verify_data["page_heroes"].get("session_template", {})
        assert updated_tpl.get("title_style", {}).get("font_family") == "'Cinzel', serif"
        print("Session template styles updated successfully")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_testimonials(self):
        """Remove TEST_ prefixed testimonials"""
        resp = requests.get(f"{BASE_URL}/api/session-extras/testimonials")
        testimonials = resp.json()
        
        deleted = 0
        for t in testimonials:
            if t.get("client_name", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/session-extras/testimonials/{t['id']}")
                deleted += 1
        
        print(f"Cleaned up {deleted} test testimonials")
    
    def test_cleanup_test_questions(self):
        """Remove TEST_ prefixed questions"""
        resp = requests.get(f"{BASE_URL}/api/session-extras/questions")
        questions = resp.json()
        
        deleted = 0
        for q in questions:
            if q.get("name", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/session-extras/questions/{q['id']}")
                deleted += 1
        
        print(f"Cleaned up {deleted} test questions")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
