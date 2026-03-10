import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { stats as mockStats } from '../mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DNAHelix = ({ style, size = 20, delay = 0, duration = 8 }) => (
  <svg
    width={size}
    height={size * 2.5}
    viewBox="0 0 20 50"
    className="absolute pointer-events-none"
    style={{
      ...style,
      animation: `dnaFloat ${duration}s ease-in-out ${delay}s infinite, dnaSpin ${duration * 1.2}s linear ${delay}s infinite`,
      opacity: 0.15,
    }}
  >
    {/* Left strand */}
    <path
      d="M4,2 C4,8 16,12 16,18 C16,24 4,28 4,34 C4,40 16,44 16,48"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Right strand */}
    <path
      d="M16,2 C16,8 4,12 4,18 C4,24 16,28 16,34 C16,40 4,44 4,48"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Rungs */}
    <line x1="5" y1="5" x2="15" y2="5" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="7" y1="10" x2="13" y2="10" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="10" y1="15" x2="10" y2="15.5" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="7" y1="20" x2="13" y2="20" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="5" y1="25" x2="15" y2="25" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="7" y1="30" x2="13" y2="30" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="10" y1="35" x2="10" y2="35.5" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="7" y1="40" x2="13" y2="40" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
    <line x1="5" y1="45" x2="15" y2="45" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
  </svg>
);

const dnaPositions = [
  { top: '8%', left: '5%', size: 14, delay: 0, duration: 9 },
  { top: '15%', left: '18%', size: 10, delay: 1.5, duration: 7 },
  { top: '5%', left: '32%', size: 12, delay: 3, duration: 10 },
  { top: '20%', left: '48%', size: 8, delay: 0.5, duration: 8 },
  { top: '10%', left: '62%', size: 11, delay: 2, duration: 9 },
  { top: '18%', left: '75%', size: 14, delay: 4, duration: 7.5 },
  { top: '6%', left: '88%', size: 10, delay: 1, duration: 11 },
  { top: '55%', left: '3%', size: 12, delay: 2.5, duration: 8.5 },
  { top: '60%', left: '22%', size: 9, delay: 3.5, duration: 10 },
  { top: '50%', left: '42%', size: 13, delay: 0.8, duration: 7 },
  { top: '65%', left: '55%', size: 10, delay: 4.5, duration: 9.5 },
  { top: '52%', left: '70%', size: 11, delay: 1.8, duration: 8 },
  { top: '58%', left: '85%', size: 14, delay: 3.2, duration: 7.5 },
  { top: '40%', left: '10%', size: 8, delay: 5, duration: 11 },
  { top: '35%', left: '92%', size: 9, delay: 2.2, duration: 9 },
];

const StatsSection = () => {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      if (response.data && response.data.length > 0) {
        setStats(response.data);
      }
    } catch (error) {
      console.log('Using mock data for stats');
    }
  };

  return (
    <section data-testid="stats-section" className="py-16 bg-gray-900 text-white relative overflow-hidden">
      {/* Animated DNA helixes */}
      {dnaPositions.map((pos, i) => (
        <DNAHelix
          key={i}
          style={{ top: pos.top, left: pos.left }}
          size={pos.size}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-400 tracking-[0.15em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dnaFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes dnaSpin {
          0% { transform: rotateY(0deg) translateY(0px); }
          25% { transform: rotateY(90deg) translateY(-6px); }
          50% { transform: rotateY(180deg) translateY(0px); }
          75% { transform: rotateY(270deg) translateY(-6px); }
          100% { transform: rotateY(360deg) translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
