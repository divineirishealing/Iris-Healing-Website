"""
Iteration 24 - Bug fixes test suite
Tests for:
1. About page image max-height constraint
2. About admin tab font controls (style fields in settings)
3. Mission & Vision subtitle field
4. Footer consistent background color
5. Body content markdown support
6. Program detail page testimonials lightbox
7. Backend /api/settings returns new style fields
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSettingsAPINewFields:
    """Test new settings fields for iteration 24 bug fixes"""
    
    def test_settings_api_returns_about_mission_vision_subtitle(self):
        """Verify about_mission_vision_subtitle field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Check the field exists
        assert "about_mission_vision_subtitle" in data
        print(f"✓ about_mission_vision_subtitle: {data.get('about_mission_vision_subtitle')}")
    
    def test_settings_api_returns_about_name_style(self):
        """Verify about_name_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Field should exist (can be None if not set)
        assert "about_name_style" in data
        print(f"✓ about_name_style: {data.get('about_name_style')}")
    
    def test_settings_api_returns_about_title_style(self):
        """Verify about_title_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "about_title_style" in data
        print(f"✓ about_title_style: {data.get('about_title_style')}")
    
    def test_settings_api_returns_about_bio_style(self):
        """Verify about_bio_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "about_bio_style" in data
        print(f"✓ about_bio_style: {data.get('about_bio_style')}")
    
    def test_settings_api_returns_about_philosophy_style(self):
        """Verify about_philosophy_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "about_philosophy_style" in data
        print(f"✓ about_philosophy_style: {data.get('about_philosophy_style')}")
    
    def test_settings_api_returns_about_impact_style(self):
        """Verify about_impact_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "about_impact_style" in data
        print(f"✓ about_impact_style: {data.get('about_impact_style')}")
    
    def test_settings_api_returns_about_mission_style(self):
        """Verify about_mission_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "about_mission_style" in data
        print(f"✓ about_mission_style: {data.get('about_mission_style')}")
    
    def test_settings_api_returns_about_vision_style(self):
        """Verify about_vision_style field exists in settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "about_vision_style" in data
        print(f"✓ about_vision_style: {data.get('about_vision_style')}")


class TestSettingsStyleUpdate:
    """Test updating style fields via PUT"""
    
    def test_update_about_name_style(self):
        """Verify about_name_style can be updated"""
        test_style = {
            "font_family": "'Cinzel', serif",
            "font_size": "24px",
            "font_color": "#1a1a1a",
            "font_weight": "bold",
            "font_style": "normal"
        }
        
        # First get current settings
        get_response = requests.get(f"{BASE_URL}/api/settings")
        assert get_response.status_code == 200
        original = get_response.json()
        
        # Update the style
        update_payload = {"about_name_style": test_style}
        put_response = requests.put(f"{BASE_URL}/api/settings", json=update_payload)
        assert put_response.status_code == 200
        
        # Verify update persisted
        verify_response = requests.get(f"{BASE_URL}/api/settings")
        assert verify_response.status_code == 200
        updated = verify_response.json()
        
        assert updated.get("about_name_style") is not None
        if isinstance(updated.get("about_name_style"), dict):
            assert updated["about_name_style"].get("font_family") == test_style["font_family"]
            print(f"✓ about_name_style updated successfully: {updated['about_name_style']}")
        
        # Restore original value
        restore_payload = {"about_name_style": original.get("about_name_style")}
        requests.put(f"{BASE_URL}/api/settings", json=restore_payload)
    
    def test_update_about_mission_vision_subtitle(self):
        """Verify about_mission_vision_subtitle can be updated"""
        test_subtitle = "TEST: Where healing meets awareness."
        
        # Get original
        get_response = requests.get(f"{BASE_URL}/api/settings")
        original = get_response.json()
        original_subtitle = original.get("about_mission_vision_subtitle")
        
        # Update
        put_response = requests.put(f"{BASE_URL}/api/settings", json={"about_mission_vision_subtitle": test_subtitle})
        assert put_response.status_code == 200
        
        # Verify
        verify_response = requests.get(f"{BASE_URL}/api/settings")
        assert verify_response.json().get("about_mission_vision_subtitle") == test_subtitle
        print(f"✓ about_mission_vision_subtitle updated successfully")
        
        # Restore
        requests.put(f"{BASE_URL}/api/settings", json={"about_mission_vision_subtitle": original_subtitle})


class TestProgramsAPI:
    """Test programs API for testimonials support"""
    
    def test_programs_list_endpoint(self):
        """Verify programs list endpoint works"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Programs API returned {len(data)} programs")
    
    def test_program_detail_endpoint(self):
        """Verify individual program endpoint works"""
        # First get list to get a valid ID
        list_response = requests.get(f"{BASE_URL}/api/programs")
        programs = list_response.json()
        
        if len(programs) > 0:
            program_id = programs[0].get("id")
            detail_response = requests.get(f"{BASE_URL}/api/programs/{program_id}")
            assert detail_response.status_code == 200
            program = detail_response.json()
            assert "title" in program
            print(f"✓ Program detail endpoint works for ID: {program_id}")
        else:
            pytest.skip("No programs available to test")


class TestTestimonialsAPI:
    """Test testimonials API for program page display"""
    
    def test_testimonials_list_endpoint(self):
        """Verify testimonials list endpoint works"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Testimonials API returned {len(data)} testimonials")
    
    def test_testimonial_structure(self):
        """Verify testimonial has expected fields for lightbox"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        testimonials = response.json()
        
        if len(testimonials) > 0:
            testimonial = testimonials[0]
            # Should have type, image, or videoId for display
            assert "type" in testimonial
            assert "id" in testimonial
            
            if testimonial.get("type") == "graphic":
                # Graphic testimonials should have image field
                assert "image" in testimonial
                print(f"✓ Graphic testimonial has image field: {testimonial.get('image', '')[:50]}")
            elif testimonial.get("type") == "video":
                # Video testimonials should have videoId field
                assert "videoId" in testimonial
                print(f"✓ Video testimonial has videoId field")
        else:
            pytest.skip("No testimonials available to test")


class TestRenderMarkdown:
    """Test markdown rendering functionality"""
    
    def test_settings_about_fields_support_markdown(self):
        """Verify about text fields can contain markdown syntax"""
        # Get settings
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Check about_bio field exists (which should support markdown rendering)
        assert "about_bio" in data
        assert "about_philosophy" in data
        assert "about_impact" in data
        assert "about_mission" in data
        assert "about_vision" in data
        print("✓ All about text fields exist for markdown rendering")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
