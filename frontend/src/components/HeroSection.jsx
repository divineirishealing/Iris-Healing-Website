import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('/api/image/')) return `${BACKEND_URL}${url}`;
  return url;
}

const HeroSection = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const videoUrl = settings?.hero_video_url ? resolveUrl(settings.hero_video_url) : '';
  const heroTitle = settings?.hero_title || 'Divine Iris\nHealing';
  const heroSubtitle = settings?.hero_subtitle || 'ETERNAL HAPPINESS';
  const subtitleColor = settings?.hero_subtitle_color || '#ffffff';
  const sectionStyle = settings?.sections?.hero || {};

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: videoUrl ? '#000' : (sectionStyle.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #0d1b2a 100%)'),
      }}
    >
      {/* Video Background */}
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Subtle gold radial for non-video */}
      {!videoUrl && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.1) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1
          data-testid="hero-title"
          className="text-white text-5xl sm:text-6xl md:text-8xl mb-4 tracking-wider animate-fade-in leading-tight whitespace-pre-line"
          style={{
            fontWeight: sectionStyle.font_weight || 400,
            fontFamily: sectionStyle.font_family ? `'${sectionStyle.font_family}', Georgia, serif` : undefined,
            fontSize: sectionStyle.font_size || undefined,
            color: sectionStyle.font_color || '#ffffff',
            fontStyle: sectionStyle.font_style || 'normal',
          }}
        >
          {heroTitle}
        </h1>

        <div className="flex items-center justify-center space-x-4 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="h-px w-12 md:w-20" style={{ backgroundColor: `${subtitleColor}40` }}></div>
          <p
            data-testid="hero-subtitle"
            className="text-sm md:text-base tracking-[0.3em] font-light"
            style={{ color: subtitleColor }}
          >
            {heroSubtitle}
          </p>
          <div className="h-px w-12 md:w-20" style={{ backgroundColor: `${subtitleColor}40` }}></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
