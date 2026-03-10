import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, Mail, Phone, Facebook, Instagram, Youtube, Linkedin, Play } from 'lucide-react';
import { Dialog, DialogContent } from '../components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function MediaPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 text-white hover:text-yellow-500"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="text-sm font-medium">MENU</span>
          </button>
          <div className="flex gap-4">
            <a href="https://facebook.com" className="text-white hover:text-yellow-500"><Facebook size={20} /></a>
            <a href="https://instagram.com" className="text-white hover:text-yellow-500"><Instagram size={20} /></a>
            <a href="https://youtube.com" className="text-white hover:text-yellow-500"><Youtube size={20} /></a>
            <a href="https://linkedin.com" className="text-white hover:text-yellow-500"><Linkedin size={20} /></a>
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
            <a href="/media" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">MEDIA</a>
            <a href="/programs" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">PROGRAMS</a>
            <a href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200">CONTACT</a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-[50vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-serif text-yellow-600 tracking-wider">MEDIA</h1>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => setSelectedVideo(testimonial.videoId)}
                >
                  <img
                    src={testimonial.thumbnail}
                    alt={`Testimonial ${testimonial.id}`}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <Play size={32} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional placeholder testimonials if needed */}
              {testimonials.length < 6 && [1, 2, 3, 4, 5, 6].slice(0, 6 - testimonials.length).map((i) => (
                <div
                  key={`placeholder-${i}`}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=600&h=800&fit=crop`}
                    alt={`Transformation ${i}`}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-sm">Transformation Story {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedVideo && (
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 Divine Iris Healing. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <a href="mailto:support@divineirishealing.com" className="w-14 h-14 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center justify-center shadow-lg">
          <Mail size={24} className="text-white" />
        </a>
        <a href="https://wa.me/971553325778" className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg">
          <Phone size={24} className="text-white" />
        </a>
      </div>
    </div>
  );
}

export default MediaPage;
