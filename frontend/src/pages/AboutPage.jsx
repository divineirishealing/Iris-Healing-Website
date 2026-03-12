import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import { HEADING, SUBTITLE, BODY, GOLD, LABEL, CONTAINER, SECTION_PY } from '../lib/designTokens';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('/api/image/')) return `${BACKEND_URL}${url}`;
  return url;
}

export default function AboutPage() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const s = settings || {};
  const aboutImage = s.about_image ? resolveUrl(s.about_image) : '';
  const logoUrl = s.logo_url ? resolveUrl(s.logo_url) : '';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section data-testid="about-hero" className="min-h-[45vh] flex flex-col items-center justify-center text-center px-6 pt-20"
        style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
        <h1 className="text-white mb-3" style={{ ...HEADING, color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontVariant: 'small-caps', letterSpacing: '0.08em' }}>
          {s.about_name || 'Dimple Ranawat'}
        </h1>
        <p style={{ ...SUBTITLE, color: '#999' }}>{s.about_title || 'Founder, Divine Iris – Soulful Healing Studio'}</p>
      </section>

      {/* Logo + Bio */}
      <section className={SECTION_PY}>
        <div className={CONTAINER}>
          {logoUrl && (
            <div className="flex justify-center mb-12">
              <img src={logoUrl} alt="Logo" className="h-24 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <div>
              {aboutImage && (
                <div className="rounded-lg overflow-hidden">
                  <img src={aboutImage} alt={s.about_name || ''} data-testid="about-image" className="w-full" style={{ objectFit: s.about_image_fit || 'contain', objectPosition: s.about_image_position || 'center top', maxHeight: '520px' }} />
                </div>
              )}
            </div>
            <div>
              <p className="mb-3" style={LABEL}>{s.about_subtitle || 'MEET THE HEALER'}</p>
              <h2 data-testid="about-name" className="mb-2" style={{ ...HEADING, fontSize: '2rem' }}>{s.about_name || 'Dimple Ranawat'}</h2>
              <p className="mb-6" style={{ ...SUBTITLE, color: GOLD, fontSize: '0.9rem' }}>{s.about_title || 'Founder, Divine Iris – Soulful Healing Studio'}</p>
              <p className="mb-6" style={BODY}>{s.about_bio || 'Dimple Ranawat is an internationally recognised healer, accountability coach, and life transformation mentor whose work is reshaping how the world understands healing, growth, and well-being.'}</p>
              {s.about_bio_2 && (
                <>
                  <h4 className="mt-4 mb-2" style={{ ...BODY, fontWeight: 600, color: '#1a1a1a' }}>Personal Journey</h4>
                  <p style={BODY}>{s.about_bio_2}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy + Impact Cards */}
      <section className={`${SECTION_PY} bg-gray-50`}>
        <div className={CONTAINER}>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-10 shadow-sm" data-testid="philosophy-card">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" className="mb-5"><path d="M12 22c-4-3-8-6-8-11a8 8 0 1116 0c0 5-4 8-8 11z"/><path d="M12 13V7"/><path d="M9 10l3-3 3 3"/></svg>
              <h3 className="mb-4" style={{ ...HEADING, fontSize: '1.2rem' }}>Our Philosophy</h3>
              <p style={BODY}>{s.about_philosophy || "Dimple believes in 'living limitless effortlessly.' Healing should not be forceful or complex. When body, mind, and soul are aligned, healing unfolds naturally."}</p>
            </div>
            <div className="bg-white rounded-lg p-10 shadow-sm" data-testid="impact-card">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" className="mb-5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <h3 className="mb-4" style={{ ...HEADING, fontSize: '1.2rem' }}>Work & Impact</h3>
              <p style={BODY}>{s.about_impact || "As the creator of the Atomic Weight Release Program, Dimple introduced a revolutionary consciousness-based approach involving atomic, subconscious, and DNA-expression levels."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={SECTION_PY} style={{ background: '#1a1a1a' }} data-testid="mission-vision">
        <div className={CONTAINER}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-2" style={{ ...HEADING, color: '#fff', fontSize: '1.6rem' }}>Mission & Vision</h2>
            <p className="text-center mb-12" style={{ ...SUBTITLE, fontSize: '0.75rem' }}>Where healing meets awareness, and transformation begins from within.</p>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="mb-4" style={{ ...HEADING, color: '#fff', fontSize: '1.1rem' }}>Our Mission</h3>
                <p style={{ ...BODY, color: '#aaa' }}>{s.about_mission || "To alleviate suffering at its root — supporting individuals in releasing emotional, mental, subconscious, and karmic weight."}</p>
              </div>
              <div>
                <h3 className="mb-4" style={{ ...HEADING, color: '#fff', fontSize: '1.1rem' }}>Our Vision</h3>
                <p style={{ ...BODY, color: '#aaa' }}>{s.about_vision || "To build a world where healing is humane, conscious, and sustainable."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
