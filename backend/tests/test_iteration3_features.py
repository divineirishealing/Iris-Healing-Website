"""
Test Suite for Iteration 3: Services Page Redesign, Upcoming Programs, Admin Program Enhancements
Tests: Services page API, Upcoming programs filter, Program new fields, Visibility/Reorder APIs
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# ============ PROGRAMS API TESTS ============

class TestProgramsAPI:
    """Tests for Programs API including new fields and filters"""
    
    def test_get_all_programs(self):
        """GET /api/programs returns all programs with new fields"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        programs = response.json()
        assert len(programs) >= 6, f"Expected at least 6 programs, got {len(programs)}"
        
        # Verify new fields exist in all programs
        for program in programs:
            assert "program_type" in program, "program_type field missing"
            assert "offer_price_usd" in program, "offer_price_usd field missing"
            assert "offer_price_inr" in program, "offer_price_inr field missing"
            assert "offer_text" in program, "offer_text field missing"
            assert "is_upcoming" in program, "is_upcoming field missing"
            assert "start_date" in program, "start_date field missing"
        print(f"PASS: All {len(programs)} programs have new fields")
    
    def test_programs_visible_only_filter(self):
        """GET /api/programs?visible_only=true returns only visible programs"""
        response = requests.get(f"{BASE_URL}/api/programs?visible_only=true")
        assert response.status_code == 200
        programs = response.json()
        
        for program in programs:
            assert program.get("visible") == True, f"Program {program['id']} should be visible"
        print(f"PASS: visible_only filter works, got {len(programs)} visible programs")
    
    def test_programs_upcoming_only_filter(self):
        """GET /api/programs?upcoming_only=true returns only upcoming programs"""
        response = requests.get(f"{BASE_URL}/api/programs?upcoming_only=true")
        assert response.status_code == 200
        programs = response.json()
        
        # Currently no programs are marked as upcoming, should return empty
        for program in programs:
            assert program.get("is_upcoming") == True, f"Program {program['id']} should be upcoming"
        print(f"PASS: upcoming_only filter works, got {len(programs)} upcoming programs")
    
    def test_programs_combined_filters(self):
        """GET /api/programs?visible_only=true&upcoming_only=true returns visible upcoming programs"""
        response = requests.get(f"{BASE_URL}/api/programs?visible_only=true&upcoming_only=true")
        assert response.status_code == 200
        programs = response.json()
        
        for program in programs:
            assert program.get("visible") == True
            assert program.get("is_upcoming") == True
        print(f"PASS: Combined filters work, got {len(programs)} visible upcoming programs")
    
    def test_program_type_values(self):
        """Verify program_type field accepts online/offline/hybrid values"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        programs = response.json()
        
        valid_types = ["online", "offline", "hybrid"]
        for program in programs:
            ptype = program.get("program_type", "")
            assert ptype in valid_types, f"Invalid program_type: {ptype}"
        print(f"PASS: All program_type values are valid")
    
    def test_get_single_program(self):
        """GET /api/programs/{id} returns single program with all new fields"""
        # Get first program ID
        response = requests.get(f"{BASE_URL}/api/programs")
        programs = response.json()
        program_id = programs[0]["id"]
        
        # Get single program
        response = requests.get(f"{BASE_URL}/api/programs/{program_id}")
        assert response.status_code == 200
        program = response.json()
        
        assert program["id"] == program_id
        assert "program_type" in program
        assert "offer_price_usd" in program
        assert "is_upcoming" in program
        assert "start_date" in program
        print(f"PASS: Single program endpoint works with new fields")


class TestProgramVisibilityAndReorder:
    """Tests for program visibility toggle and reorder APIs"""
    
    def test_toggle_program_visibility(self):
        """PATCH /api/programs/{id}/visibility toggles visibility"""
        # Get first program
        response = requests.get(f"{BASE_URL}/api/programs")
        programs = response.json()
        program_id = programs[0]["id"]
        original_visible = programs[0]["visible"]
        
        # Toggle visibility
        new_visible = not original_visible
        response = requests.patch(
            f"{BASE_URL}/api/programs/{program_id}/visibility",
            json={"visible": new_visible}
        )
        assert response.status_code == 200
        result = response.json()
        assert result["visible"] == new_visible
        
        # Restore original visibility
        response = requests.patch(
            f"{BASE_URL}/api/programs/{program_id}/visibility",
            json={"visible": original_visible}
        )
        assert response.status_code == 200
        print(f"PASS: Program visibility toggle works")
    
    def test_reorder_programs(self):
        """PATCH /api/programs/reorder reorders programs"""
        # Get current order
        response = requests.get(f"{BASE_URL}/api/programs")
        programs = response.json()
        original_order = [p["id"] for p in programs]
        
        # Reverse order
        reversed_order = list(reversed(original_order))
        response = requests.patch(
            f"{BASE_URL}/api/programs/reorder",
            json={"order": reversed_order}
        )
        assert response.status_code == 200
        
        # Verify order changed
        response = requests.get(f"{BASE_URL}/api/programs")
        new_programs = response.json()
        new_order = [p["id"] for p in new_programs]
        assert new_order == reversed_order
        
        # Restore original order
        response = requests.patch(
            f"{BASE_URL}/api/programs/reorder",
            json={"order": original_order}
        )
        assert response.status_code == 200
        print(f"PASS: Program reorder works")


class TestProgramCRUD:
    """Tests for creating/updating programs with new fields"""
    
    def test_create_program_with_new_fields(self):
        """POST /api/programs creates program with new fields"""
        new_program = {
            "title": "TEST_Upcoming Program",
            "category": "Test",
            "description": "Test program for iteration 3",
            "image": "https://example.com/test.jpg",
            "price_usd": 199,
            "price_inr": 15000,
            "program_type": "hybrid",
            "offer_price_usd": 149,
            "offer_price_inr": 11000,
            "offer_text": "25% OFF",
            "is_upcoming": True,
            "start_date": "April 1, 2026"
        }
        
        response = requests.post(f"{BASE_URL}/api/programs", json=new_program)
        assert response.status_code == 200
        created = response.json()
        
        assert created["title"] == new_program["title"]
        assert created["program_type"] == "hybrid"
        assert created["offer_price_usd"] == 149
        assert created["offer_text"] == "25% OFF"
        assert created["is_upcoming"] == True
        assert created["start_date"] == "April 1, 2026"
        
        # Cleanup - delete test program
        program_id = created["id"]
        delete_response = requests.delete(f"{BASE_URL}/api/programs/{program_id}")
        assert delete_response.status_code == 200
        print(f"PASS: Create program with new fields works")
    
    def test_update_program_new_fields(self):
        """PUT /api/programs/{id} updates program with new fields"""
        # Create test program first
        new_program = {
            "title": "TEST_Update Program",
            "category": "Test",
            "description": "Test program for update",
            "image": "https://example.com/test.jpg",
            "program_type": "online",
            "is_upcoming": False
        }
        
        response = requests.post(f"{BASE_URL}/api/programs", json=new_program)
        assert response.status_code == 200
        program_id = response.json()["id"]
        
        # Update with new field values
        update_data = {
            "title": "TEST_Update Program",
            "category": "Updated",
            "description": "Updated description",
            "image": "https://example.com/test.jpg",
            "program_type": "offline",
            "offer_price_usd": 99,
            "offer_text": "Special Offer",
            "is_upcoming": True,
            "start_date": "May 15, 2026"
        }
        
        response = requests.put(f"{BASE_URL}/api/programs/{program_id}", json=update_data)
        assert response.status_code == 200
        updated = response.json()
        
        assert updated["program_type"] == "offline"
        assert updated["offer_price_usd"] == 99
        assert updated["offer_text"] == "Special Offer"
        assert updated["is_upcoming"] == True
        assert updated["start_date"] == "May 15, 2026"
        
        # Verify with GET
        response = requests.get(f"{BASE_URL}/api/programs/{program_id}")
        assert response.status_code == 200
        fetched = response.json()
        assert fetched["is_upcoming"] == True
        assert fetched["program_type"] == "offline"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/programs/{program_id}")
        print(f"PASS: Update program with new fields works")


# ============ SESSIONS API TESTS ============

class TestSessionsAPI:
    """Tests for Sessions API (for Services page)"""
    
    def test_get_all_sessions(self):
        """GET /api/sessions returns all sessions (should be 21)"""
        response = requests.get(f"{BASE_URL}/api/sessions")
        assert response.status_code == 200
        sessions = response.json()
        assert len(sessions) >= 21, f"Expected at least 21 sessions, got {len(sessions)}"
        print(f"PASS: Got {len(sessions)} sessions")
    
    def test_sessions_visible_only_filter(self):
        """GET /api/sessions?visible_only=true returns only visible sessions"""
        response = requests.get(f"{BASE_URL}/api/sessions?visible_only=true")
        assert response.status_code == 200
        sessions = response.json()
        
        for session in sessions:
            assert session.get("visible") == True
        print(f"PASS: visible_only filter works for sessions, got {len(sessions)}")
    
    def test_session_fields(self):
        """Verify session has all required fields"""
        response = requests.get(f"{BASE_URL}/api/sessions")
        sessions = response.json()
        
        required_fields = ["id", "title", "description", "image", "visible", "order"]
        for session in sessions:
            for field in required_fields:
                assert field in session, f"Session missing field: {field}"
        print(f"PASS: All sessions have required fields")
    
    def test_get_single_session(self):
        """GET /api/sessions/{id} returns single session"""
        response = requests.get(f"{BASE_URL}/api/sessions")
        sessions = response.json()
        session_id = sessions[0]["id"]
        
        response = requests.get(f"{BASE_URL}/api/sessions/{session_id}")
        assert response.status_code == 200
        session = response.json()
        assert session["id"] == session_id
        print(f"PASS: Single session endpoint works")


# ============ TESTIMONIALS API TESTS ============

class TestTestimonialsAPI:
    """Tests for Testimonials API"""
    
    def test_get_all_testimonials(self):
        """GET /api/testimonials returns all testimonials (should be 44)"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        testimonials = response.json()
        assert len(testimonials) >= 44, f"Expected at least 44 testimonials, got {len(testimonials)}"
        print(f"PASS: Got {len(testimonials)} testimonials")
    
    def test_testimonials_type_filter_graphic(self):
        """GET /api/testimonials?type=graphic returns only graphic testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials?type=graphic")
        assert response.status_code == 200
        testimonials = response.json()
        
        for t in testimonials:
            assert t.get("type") == "graphic"
        print(f"PASS: Type filter works, got {len(testimonials)} graphic testimonials")
    
    def test_testimonials_type_filter_video(self):
        """GET /api/testimonials?type=video returns only video testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials?type=video")
        assert response.status_code == 200
        testimonials = response.json()
        
        for t in testimonials:
            assert t.get("type") == "video"
        print(f"PASS: Type filter works, got {len(testimonials)} video testimonials")
    
    def test_testimonials_search(self):
        """GET /api/testimonials?search=healing returns filtered results"""
        response = requests.get(f"{BASE_URL}/api/testimonials?search=healing")
        assert response.status_code == 200
        testimonials = response.json()
        print(f"PASS: Search works, got {len(testimonials)} results for 'healing'")


# ============ SITE SETTINGS API TESTS ============

class TestSiteSettingsAPI:
    """Tests for Site Settings API"""
    
    def test_get_settings(self):
        """GET /api/settings returns site settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        settings = response.json()
        
        required_fields = ["heading_font", "body_font", "heading_color", "body_color", "accent_color"]
        for field in required_fields:
            assert field in settings, f"Settings missing field: {field}"
        print(f"PASS: Site settings endpoint works")
    
    def test_update_settings(self):
        """PUT /api/settings updates site settings"""
        # Get current settings
        response = requests.get(f"{BASE_URL}/api/settings")
        original = response.json()
        
        # Update settings
        update_data = {
            "heading_font": "Cinzel",
            "body_font": "Lato",
            "heading_color": original.get("heading_color", "#1a1a1a"),
            "body_color": original.get("body_color", "#4a4a4a"),
            "accent_color": original.get("accent_color", "#D4AF37"),
            "heading_size": "large",
            "body_size": "default"
        }
        
        response = requests.put(f"{BASE_URL}/api/settings", json=update_data)
        assert response.status_code == 200
        
        # Verify update
        response = requests.get(f"{BASE_URL}/api/settings")
        updated = response.json()
        assert updated["heading_font"] == "Cinzel"
        
        # Restore original
        restore_data = {
            "heading_font": original.get("heading_font", "Playfair Display"),
            "body_font": original.get("body_font", "Lato"),
            "heading_color": original.get("heading_color", "#1a1a1a"),
            "body_color": original.get("body_color", "#4a4a4a"),
            "accent_color": original.get("accent_color", "#D4AF37"),
            "heading_size": original.get("heading_size", "default"),
            "body_size": original.get("body_size", "default")
        }
        requests.put(f"{BASE_URL}/api/settings", json=restore_data)
        print(f"PASS: Site settings update works")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
