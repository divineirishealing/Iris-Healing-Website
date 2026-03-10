import React, { useState } from 'react';
import { Menu, X, Facebook, Instagram, Youtube, Linkedin, Mail, Phone } from 'lucide-react';

function TransformationsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Testimonial image URLs from the original site
  const testimonialImages = [
    'https://divineirishealing.com/assets/images/testimonials/1770288231_121a7ff8d43c21a47ee2.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770288262_5df1ff82fddb95f146db.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770288598_757da7a271614cb10822.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289072_ab4f5c6689469efb1b7f.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289093_21c29f8d6a2dc5b1c8a9.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289131_cf06997582aa897db7fc.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289153_a072f5d42a5e02165c0d.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289174_ac0c9bfc32bdb9d84fe4.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289192_8c6bc2f9b2dbd96e74ee.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289210_ef2a4f93ca54c382c728.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289233_e3aba475fa78bcff3752.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289258_972d592ed0dff3e89a5a.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289281_4a39ab61be8e4c6ebf18.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289418_aa10db6d9677c85dc8fb.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289438_c49463798e7912dd6e27.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1770289472_43d8c1c0643b30020f1c.jpeg',
    'https://divineirishealing.com/assets/images/testimonials/1771406783_77c4cb3d51018f66cff5.png',
    'https://divineirishealing.com/assets/images/testimonials/1771406888_f8b37016b522d4450f27.png',
    'https://divineirishealing.com/assets/images/testimonials/1771406917_39f6286cdc703cdb44b1.png',
    'https://divineirishealing.com/assets/images/testimonials/1771407030_074208cdb860ec07bcd0.png',
    'https://divineirishealing.com/assets/images/testimonials/1771407096_e288442d79f8ba3078e2.png',
    'https://divineirishealing.com/assets/images/testimonials/1771407127_934cf075f73a9a06cca1.png',
    'https://divineirishealing.com/assets/images/testimonials/1771407192_2191bb436611415332f0.png',
    'https://divineirishealing.com/assets/images/testimonials/1771407239_d3ea8d010f7f5ad2d89e.png',
  ];

  return (
    <div className=\"min-h-screen bg-white\">
      {/* Header */}
      <header className=\"fixed top-0 left-0 right-0 z-50 bg-black\">
        <div className=\"container mx-auto px-4 py-4 flex justify-between items-center\">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className=\"flex items-center gap-2 text-white hover:text-yellow-500 transition-colors\"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className=\"text-sm font-medium tracking-wider\">MENU</span>
          </button>
          <div className=\"flex gap-4\">
            <a href=\"https://facebook.com\" className=\"text-white hover:text-yellow-500 transition-colors\"><Facebook size={20} /></a>
            <a href=\"https://instagram.com\" className=\"text-white hover:text-yellow-500 transition-colors\"><Instagram size={20} /></a>
            <a href=\"https://youtube.com\" className=\"text-white hover:text-yellow-500 transition-colors\"><Youtube size={20} /></a>
            <a href=\"https://linkedin.com\" className=\"text-white hover:text-yellow-500 transition-colors\"><Linkedin size={20} /></a>
          </div>
        </div>
      </header>

      {/* Golden Menu Overlay */}
      {isMenuOpen && (
        <div className=\"fixed inset-0 z-40 bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-800 flex items-center justify-center\">
          <nav className=\"text-center space-y-8\">
            <a href=\"/\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>HOME</a>
            <a href=\"/#about\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>ABOUT</a>
            <a href=\"/services\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>SERVICES</a>
            <a href=\"/sessions\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>UPCOMING SESSIONS</a>
            <a href=\"/media\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>MEDIA</a>
            <a href=\"/programs\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>PROGRAMS</a>
            <a href=\"/contact\" onClick={() => setIsMenuOpen(false)} className=\"block text-white text-3xl font-light tracking-widest hover:text-yellow-200 transition-colors\" style={{ fontFamily: \"'Playfair Display', serif\" }}>CONTACT</a>
          </nav>
        </div>
      )}

      {/* Hero Section - Dark with Gold Title */}
      <section className=\"min-h-[50vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center text-center px-4 pt-24\">
        <h1 className=\"text-6xl md:text-8xl mb-6 tracking-wider\" style={{ fontFamily: \"'Playfair Display', serif\", color: '#D4AF37', fontWeight: 400 }}>
          TRANSFORMATIONS
        </h1>
        <p className=\"text-gray-400 text-lg tracking-wide\" style={{ fontFamily: \"'Lato', sans-serif\" }}>
          Stories of Healing, Growth & Awakening
        </p>
      </section>

      {/* Testimonials Grid - Light Background */}
      <section className=\"py-16 bg-gray-50\">
        <div className=\"container mx-auto px-4\">
          <div className=\"max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">
            {testimonialImages.map((image, index) => (
              <div
                key={index}
                className=\"bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden\"
              >
                <img
                  src={image}
                  alt={`Transformation ${index + 1}`}
                  className=\"w-full h-auto object-contain\"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Testimonial';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=\"bg-gray-900 text-white py-12\">
        <div className=\"container mx-auto px-4 text-center\">
          <p className=\"text-gray-500 text-sm\">&copy; 2026 Divine Iris Healing. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Floating Contact Buttons */}
      <div className=\"fixed right-6 bottom-6 flex flex-col gap-3 z-40\">
        <a href=\"mailto:support@divineirishealing.com\" className=\"w-14 h-14 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110\">
          <Mail size={24} className=\"text-white\" />
        </a>
        <a href=\"https://wa.me/971553325778\" target=\"_blank\" rel=\"noopener noreferrer\" className=\"w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110\">
          <Phone size={24} className=\"text-white\" />
        </a>
      </div>
    </div>
  );
}

export default TransformationsPage;
