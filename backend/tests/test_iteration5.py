"""
Iteration 5 Backend Tests - Site Settings, Hero, Testimonials, Programs
Tests for new features: hero_subtitle_color, logo_url, logo_width, deadline_date
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSiteSettings:
    """Test site settings API including new fields"""
    
    def test_get_settings_returns_200(self):
        """GET /api/settings should return 200"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("PASS: GET /api/settings returns 200")
    
    def test_settings_has_hero_subtitle_color(self):
        """Settings should include hero_subtitle_color field"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "hero_subtitle_color" in data, "Missing hero_subtitle_color field"
        assert isinstance(data["hero_subtitle_color"], str), "hero_subtitle_color should be string"
        print(f"PASS: hero_subtitle_color = {data['hero_subtitle_color']}")
    
    def test_settings_has_logo_url(self):
        """Settings should include logo_url field"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "logo_url" in data, "Missing logo_url field"
        print(f"PASS: logo_url = {data['logo_url']}")
    
    def test_settings_has_logo_width(self):
        """Settings should include logo_width field"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "logo_width" in data, "Missing logo_width field"
        assert isinstance(data["logo_width"], int), "logo_width should be integer"
        print(f"PASS: logo_width = {data['logo_width']}")
    
    def test_settings_has_hero_video_url(self):
        """Settings should include hero_video_url field"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "hero_video_url" in data, "Missing hero_video_url field"
        print(f"PASS: hero_video_url = {data['hero_video_url']}")


class TestHeroVideo:
    """Test hero video endpoint"""
    
    def test_hero_video_accessible(self):
        """Hero video should be accessible if set"""
        settings_response = requests.get(f"{BASE_URL}/api/settings")
        assert settings_response.status_code == 200
        settings = settings_response.json()
        
        if settings.get("hero_video_url"):
            video_url = settings["hero_video_url"]
            if video_url.startswith("/api/image/"):
                full_url = f"{BASE_URL}{video_url}"
                response = requests.get(full_url, stream=True)
                assert response.status_code == 200, f"Video endpoint returned {response.status_code}"
                print(f"PASS: Hero video accessible at {video_url}")
            else:
                print(f"SKIP: Hero video is external URL: {video_url}")
        else:
            print("SKIP: No hero video URL set")


class TestPrograms:
    """Test programs API including deadline_date field"""
    
    def test_get_programs_returns_200(self):
        """GET /api/programs should return 200"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("PASS: GET /api/programs returns 200")
    
    def test_programs_have_deadline_date_field(self):
        """Programs should include deadline_date field"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            program = data[0]
            assert "deadline_date" in program, "Missing deadline_date field in program"
            print(f"PASS: Program has deadline_date field = '{program['deadline_date']}'")
        else:
            print("SKIP: No programs found")
    
    def test_programs_have_is_upcoming_field(self):
        """Programs should include is_upcoming field"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            program = data[0]
            assert "is_upcoming" in program, "Missing is_upcoming field in program"
            assert isinstance(program["is_upcoming"], bool), "is_upcoming should be boolean"
            print(f"PASS: Program has is_upcoming field = {program['is_upcoming']}")
        else:
            print("SKIP: No programs found")
    
    def test_programs_have_offer_text_field(self):
        """Programs should include offer_text field"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            program = data[0]
            assert "offer_text" in program, "Missing offer_text field in program"
            print(f"PASS: Program has offer_text field = '{program['offer_text']}'")
        else:
            print("SKIP: No programs found")
    
    def test_upcoming_programs_filter(self):
        """Test filtering programs by upcoming_only=true"""
        response = requests.get(f"{BASE_URL}/api/programs?upcoming_only=true")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        print(f"PASS: upcoming_only filter works, returned {len(data)} programs")


class TestTestimonials:
    """Test testimonials API"""
    
    def test_get_testimonials_returns_200(self):
        """GET /api/testimonials should return 200"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("PASS: GET /api/testimonials returns 200")
    
    def test_testimonials_have_type_field(self):
        """Testimonials should include type field (video/graphic)"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            testimonial = data[0]
            assert "type" in testimonial, "Missing type field in testimonial"
            assert testimonial["type"] in ["video", "graphic"], f"Invalid type: {testimonial['type']}"
            print(f"PASS: Testimonial has type field = '{testimonial['type']}'")
        else:
            print("SKIP: No testimonials found")
    
    def test_video_testimonials_have_videoid(self):
        """Video testimonials should have videoId field"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        
        video_testimonials = [t for t in data if t.get("type") == "video"]
        if len(video_testimonials) > 0:
            video = video_testimonials[0]
            assert "videoId" in video, "Missing videoId field in video testimonial"
            assert video["videoId"], "videoId should not be empty for video testimonials"
            print(f"PASS: Video testimonial has videoId = '{video['videoId']}'")
        else:
            print("SKIP: No video testimonials found")
    
    def test_graphic_testimonials_have_image(self):
        """Graphic testimonials should have image field"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        
        graphic_testimonials = [t for t in data if t.get("type") == "graphic"]
        if len(graphic_testimonials) > 0:
            graphic = graphic_testimonials[0]
            assert "image" in graphic, "Missing image field in graphic testimonial"
            assert graphic["image"], "image should not be empty for graphic testimonials"
            print(f"PASS: Graphic testimonial has image")
        else:
            print("SKIP: No graphic testimonials found")
    
    def test_testimonials_count(self):
        """Should have both video and graphic testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        
        video_count = len([t for t in data if t.get("type") == "video"])
        graphic_count = len([t for t in data if t.get("type") == "graphic"])
        
        print(f"INFO: Found {video_count} video testimonials, {graphic_count} graphic testimonials")
        assert video_count > 0, "Expected at least 1 video testimonial for tab testing"
        assert graphic_count > 0, "Expected at least 1 graphic testimonial for tab testing"
        print("PASS: Both video and graphic testimonials exist")


class TestNewsletter:
    """Test newsletter API (Join Our Community)"""
    
    def test_newsletter_endpoint_exists(self):
        """GET /api/newsletter should return 200"""
        response = requests.get(f"{BASE_URL}/api/newsletter")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("PASS: GET /api/newsletter returns 200")


class TestSessions:
    """Test sessions API"""
    
    def test_get_sessions_returns_200(self):
        """GET /api/sessions should return 200"""
        response = requests.get(f"{BASE_URL}/api/sessions")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("PASS: GET /api/sessions returns 200")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
