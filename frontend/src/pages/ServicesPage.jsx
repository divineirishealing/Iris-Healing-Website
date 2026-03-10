import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Menu, X, Mail, Phone, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ServicesPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await axios.get(`${API}/sessions`);
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 text-gray-900 hover:text-yellow-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="text-sm font-medium">MENU</span>
          </button>
          <div className="flex gap-4">
            <a href="https://facebook.com" className="text-gray-600 hover:text-yellow-600"><Facebook size={20} /></a>
            <a href="https://instagram.com" className="text-gray-600 hover:text-yellow-600"><Instagram size={20} /></a>
            <a href="https://youtube.com" className="text-gray-600 hover:text-yellow-600"><Youtube size={20} /></a>
            <a href="https://linkedin.com" className="text-gray-600 hover:text-yellow-600"><Linkedin size={20} /></a>
          </div>
        </div>
      </header>

      {/* Golden Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-800 flex items-center justify-center">
          <nav className="text-center space-y-8">
            <a href="/" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">HOME</a>
            <a href="/#about" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">ABOUT</a>
            <a href="/services" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">SERVICES</a>
            <a href="/sessions" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">UPCOMING SESSIONS</a>
            <a href="/#media" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">MEDIA</a>
            <a href="/programs" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">PROGRAMS</a>
            <a href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">CONTACT</a>
          </nav>
        </div>
      )}

      {/* Main Content - Sidebar Layout */}
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-[300px_1fr] gap-8">
              {/* Left Sidebar - Session List */}
              <div className="bg-white shadow-lg rounded-lg p-4">
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full text-left px-4 py-3 rounded transition-all ${
                        selectedSession?.id === session.id
                          ? 'bg-yellow-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      } flex items-center justify-between`}
                    >
                      <span className="text-sm">{session.title}</span>
                      <span>›</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Session Details */}
              {selectedSession && (
                <div className="bg-white shadow-lg rounded-lg p-8">
                  <div className="mb-8">
                    <img
                      src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=400&fit=crop"
                      alt="Iris Flower"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <h1 className="text-4xl font-serif mb-6">{selectedSession.title}</h1>
                  <p className="text-gray-700 leading-relaxed text-lg mb-8">{selectedSession.description}</p>
                  <Button
                    onClick={() => navigate(`/checkout/session/${selectedSession.id}`)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full"
                  >
                    VIEW DETAILS & BOOK
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <a href="mailto:support@divineirishealing.com" className="w-14 h-14 bg-yellow-600 rounded-full flex items-center justify-center shadow-lg"><Mail size={24} className="text-white" /></a>
        <a href="https://wa.me/971553325778" className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"><Phone size={24} className="text-white" /></a>
      </div>
    </div>
  );
}

export default ServicesPage;