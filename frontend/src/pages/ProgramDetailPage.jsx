import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Menu, X, Facebook, Instagram, Youtube, Linkedin, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonialImages = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces',
  ];

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    try {
      const response = await axios.get(`${API}/programs/${id}`);
      setProgram(response.data);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialImages.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonialImages.length) % testimonialImages.length);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-xl text-white">Loading...</div></div>;
  if (!program) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-center"><h2 className="text-2xl font-bold text-white mb-4">Program Not Found</h2><Button onClick={() => navigate('/')} className="bg-yellow-600 hover:bg-yellow-700">Back to Home</Button></div></div>;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with GOLDEN menu */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:bg-white/10 rounded transition-colors flex items-center gap-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              <span className="text-sm font-medium">MENU</span>
            </button>
            <div className="flex items-center space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-yellow-500 transition-colors"><Facebook size={20} /></a>
              <a href="https://instagram.com" className="text-white hover:text-yellow-500 transition-colors"><Instagram size={20} /></a>
              <a href="https://youtube.com" className="text-white hover:text-yellow-500 transition-colors"><Youtube size={20} /></a>
              <a href="https://linkedin.com" className="text-white hover:text-yellow-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </header>

      {/* GOLDEN GRADIENT MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-800 flex items-center justify-center">
          <nav className="text-center space-y-8">
            <a href="/" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">HOME</a>
            <a href="/#about" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">ABOUT</a>
            <a href="/services" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">SERVICES</a>
            <a href="/sessions" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">UPCOMING SESSIONS</a>
            <a href="/#media" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">MEDIA</a>
            <a href="/programs" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">PROGRAMS</a>
            <a href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors">CONTACT</a>
          </nav>
        </div>
      )}

      {/* Hero */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <p className="text-yellow-600 text-sm tracking-[0.3em] uppercase mb-6">FLAGSHIP PROGRAM | FOUNDATION OF ALL WORK</p>
        <h1 className="text-white text-4xl md:text-6xl font-serif mb-8 max-w-4xl leading-tight">{program.title}</h1>
        <div className="h-1 w-24 bg-yellow-600 mx-auto"></div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-16">
            <h2 className="text-3xl font-serif text-center mb-8">The Journey</h2>
            <div className="h-1 w-16 bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-gray-700 leading-relaxed text-lg text-justify">{program.description}</p>
          </div>

          <div className="mb-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-serif mb-6">Who it is for</h2>
            <p className="text-yellow-700 italic mb-4">A Sacred Invitation for those who resonate</p>
            <ul className="space-y-3 text-gray-700">
              <li>• You feel chronically tired, heavy, or emotionally burdened despite effort and awareness</li>
              <li>• You experience recurring health issues with no clear explanation</li>
              <li>• Your life keeps repeating similar emotional, relational, or professional patterns</li>
            </ul>
          </div>
        </div>
      </section>

      {/* YOUR EXPERIENCE - Dark background with photo */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12 text-yellow-600">Your Experience</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop&crop=faces" alt="Healer" className="w-full rounded-lg shadow-2xl" />
            </div>
            <div className="text-white space-y-4">
              <p className="leading-relaxed text-lg">You begin to experience an internal lightness that feels unfamiliar yet deeply natural. The body softens, breathing deepens, and emotional reactions lose their intensity.</p>
              <p className="leading-relaxed text-lg">Patterns that once felt automatic start dissolving without conscious effort. Healing no longer feels like work — it becomes a by-product of inner safety and release.</p>
              <p className="leading-relaxed text-lg italic text-yellow-500">Many people describe this phase as finally living a happy life in the true sense, not because life is perfect, but because it is no longer heavy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-yellow-700 text-sm tracking-widest mb-4">WHEN YOU ARE SEEKING</p>
          <p className="text-gray-700 text-lg mb-8">When you are done fixing, forcing, or proving — and you are ready to live with ease, clarity, and emotional freedom — this program becomes the foundation for that shift.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {program.price_usd > 0 && (
              <Button onClick={() => navigate(`/checkout/program/${program.id}`)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-6 text-lg">Pay Now</Button>
            )}
            <Button onClick={() => navigate('/contact')} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg">Express Your Interest</Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Horizontal Carousel */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12 text-yellow-700">Testimonials</h2>
          <div className="max-w-6xl mx-auto relative">
            <div className="flex items-center justify-center gap-4 overflow-hidden">
              <button onClick={prevTestimonial} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><ChevronLeft /></button>
              <div className="flex gap-4 transition-transform duration-500">
                {testimonialImages.slice(currentTestimonial, currentTestimonial + 5).map((img, i) => (
                  <img key={i} src={img} alt={`Testimonial ${i + 1}`} className="w-48 h-48 object-cover rounded-lg shadow-lg" />
                ))}
              </div>
              <button onClick={nextTestimonial} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><ChevronRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 Divine Iris Healing. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <a href="mailto:support@divineirishealing.com" className="w-14 h-14 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center justify-center shadow-lg"><Mail size={24} className="text-white" /></a>
        <a href="https://wa.me/971553325778" className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg"><Phone size={24} className="text-white" /></a>
      </div>
    </div>
  );
}

export default ProgramDetailPage;