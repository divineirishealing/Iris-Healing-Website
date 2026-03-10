import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../lib/imageUtils';
import { MapPin, Monitor, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UpcomingProgramsSection = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    loadUpcoming();
  }, []);

  const loadUpcoming = async () => {
    try {
      const response = await axios.get(`${API}/programs?visible_only=true&upcoming_only=true`);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error loading upcoming programs:', error);
    }
  };

  if (programs.length === 0) return null;

  const typeIcon = (t) => {
    if (t === 'offline') return <MapPin size={14} />;
    if (t === 'hybrid') return <><Monitor size={14} /><MapPin size={14} /></>;
    return <Monitor size={14} />;
  };

  const typeLabel = (t) => {
    if (t === 'offline') return 'In-Person';
    if (t === 'hybrid') return 'Online + In-Person';
    return 'Online';
  };

  return (
    <section id="upcoming" data-testid="upcoming-programs-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-[#D4AF37] text-xs tracking-[0.25em] uppercase mb-3">Upcoming</p>
          <h2 className="text-3xl md:text-4xl text-gray-900">Upcoming Programs</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              data-testid={`upcoming-card-${program.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Program Image / Graphic */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={resolveImageUrl(program.image)}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop';
                  }}
                />
                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                    program.program_type === 'offline'
                      ? 'bg-emerald-500 text-white'
                      : program.program_type === 'hybrid'
                        ? 'bg-purple-500 text-white'
                        : 'bg-blue-500 text-white'
                  }`}>
                    {typeIcon(program.program_type)}
                    {typeLabel(program.program_type)}
                  </span>
                </div>
                {/* Offer badge */}
                {program.offer_text && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {program.offer_text}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-[#D4AF37] text-xs tracking-wider mb-1 uppercase">{program.category}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{program.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{program.description}</p>

                {/* Date */}
                {program.start_date && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                    <Calendar size={14} />
                    <span>Starts: {program.start_date}</span>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-t pt-4 mt-auto">
                  <div className="flex items-baseline gap-3 mb-3">
                    {program.offer_price_usd > 0 ? (
                      <>
                        <span className="text-2xl font-bold text-[#D4AF37]">${program.offer_price_usd}</span>
                        <span className="text-sm text-gray-400 line-through">${program.price_usd}</span>
                      </>
                    ) : program.price_usd > 0 ? (
                      <span className="text-2xl font-bold text-gray-900">${program.price_usd}</span>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Contact for pricing</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/program/${program.id}`)}
                      data-testid={`upcoming-know-more-${program.id}`}
                      className="flex-1 bg-[#1a1a1a] hover:bg-[#333] text-white py-2.5 rounded-full text-xs tracking-wider transition-all duration-300 uppercase font-medium"
                    >
                      Know More
                    </button>
                    {(program.price_usd > 0 || program.offer_price_usd > 0) && (
                      <button
                        onClick={() => navigate(`/checkout/program/${program.id}`)}
                        data-testid={`upcoming-enroll-${program.id}`}
                        className="flex-1 bg-[#D4AF37] hover:bg-[#b8962e] text-white py-2.5 rounded-full text-xs tracking-wider transition-all duration-300 uppercase font-medium"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingProgramsSection;
