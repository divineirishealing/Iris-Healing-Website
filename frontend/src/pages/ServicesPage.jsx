import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import { resolveImageUrl } from '../lib/imageUtils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ServicesPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await axios.get(`${API}/sessions?visible_only=true`);
      setSessions(response.data);
      if (response.data.length > 0) {
        setSelectedSession(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section
        className="min-h-[30vh] flex flex-col items-center justify-center text-center px-4 pt-24"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #0d1b2a 100%)' }}
      >
        <h1
          data-testid="services-title"
          className="text-4xl md:text-5xl mb-3 tracking-wider"
          style={{ color: '#D4AF37', fontWeight: 400 }}
        >
          Book Personal Session
        </h1>
      </section>

      {/* Main Layout - exact match to original */}
      <div className="bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <aside
            data-testid="services-sidebar"
            className="w-full md:w-[380px] md:min-w-[380px] border-r border-gray-200 bg-white"
          >
            <div className="md:sticky md:top-16 md:max-h-screen md:overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {sessions.map((session, idx) => (
                <button
                  key={session.id}
                  data-testid={`service-tab-${session.id}`}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all border-b border-gray-100 group ${
                    selectedSession?.id === session.id
                      ? 'bg-white border-l-[3px] border-l-[#D4AF37]'
                      : 'hover:bg-gray-50 border-l-[3px] border-l-transparent'
                  }`}
                >
                  <span
                    className={`text-sm ${
                      selectedSession?.id === session.id
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-700'
                    }`}
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {session.title}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`flex-shrink-0 ml-3 transition-colors ${
                      selectedSession?.id === session.id
                        ? 'text-[#D4AF37]'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* Right Content */}
          {selectedSession && (
            <main data-testid="service-detail" className="flex-1 px-6 md:px-12 py-8 md:py-12">
              {/* "Claim your Personal space" header with iris image */}
              <div className="relative mb-8 rounded-lg overflow-hidden">
                <img
                  src={resolveImageUrl(selectedSession.image)}
                  alt={selectedSession.title}
                  className="w-full h-[320px] md:h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = 'https://divineirishealing.com/assets/images/personal_sessions/1772606496_19c12e333a98b4e53349.png';
                  }}
                />
                <div className="absolute top-6 left-6 md:top-10 md:left-10">
                  <h2
                    className="text-3xl md:text-5xl leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 700,
                      color: '#1a1a1a',
                    }}
                  >
                    Claim your
                    <br />
                    <em className="font-normal">Personal space</em>
                  </h2>
                </div>
              </div>

              {/* Session title - UPPERCASE */}
              <h3
                data-testid="service-detail-title"
                className="text-xl md:text-2xl tracking-[0.08em] mb-6"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 400,
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                }}
              >
                {selectedSession.title}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed mb-10 max-w-[700px]"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '15px',
                  color: '#4a4a4a',
                  lineHeight: '1.8',
                }}
              >
                {selectedSession.description}
              </p>

              {/* CTA Button - dark, rounded */}
              <button
                onClick={() => navigate(`/session/${selectedSession.id}`)}
                data-testid="view-details-book-btn"
                className="inline-block bg-[#1a1a1a] hover:bg-[#333] text-white px-10 py-4 rounded-full text-xs tracking-[0.2em] transition-all duration-300 uppercase font-medium"
              >
                View Details & Book
              </button>
            </main>
          )}
        </div>
      </div>

      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default ServicesPage;
