import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { stats as mockStats } from '../mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const statIcons = [
  /* Happy Souls - group of people */
  <svg viewBox="0 0 40 40" fill="#d4a843" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="8" r="5" />
    <ellipse cx="20" cy="28" rx="8" ry="10" />
    <circle cx="8" cy="12" r="3.5" />
    <ellipse cx="8" cy="28" rx="5.5" ry="8" />
    <circle cx="32" cy="12" r="3.5" />
    <ellipse cx="32" cy="28" rx="5.5" ry="8" />
  </svg>,
  /* Years Experience - calendar */
  <svg viewBox="0 0 40 40" fill="#d4a843" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="32" height="28" rx="3" fill="none" stroke="#d4a843" strokeWidth="2.5" />
    <line x1="12" y1="4" x2="12" y2="12" stroke="#d4a843" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="4" x2="28" y2="12" stroke="#d4a843" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4" y1="16" x2="36" y2="16" stroke="#d4a843" strokeWidth="2" />
    <rect x="10" y="20" width="5" height="4" rx="0.5" fill="#d4a843" />
    <rect x="17.5" y="20" width="5" height="4" rx="0.5" fill="#d4a843" />
    <rect x="25" y="20" width="5" height="4" rx="0.5" fill="#d4a843" />
    <rect x="10" y="28" width="5" height="4" rx="0.5" fill="#d4a843" />
    <rect x="17.5" y="28" width="5" height="4" rx="0.5" fill="#d4a843" />
    <rect x="25" y="28" width="5" height="4" rx="0.5" fill="#d4a843" />
  </svg>,
  /* Transformations - infinity */
  <svg viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14,14 C14,8 8,4 4,8 C0,12 0,16 4,20 C8,24 14,20 14,14 Z" stroke="#d4a843" strokeWidth="2.5" fill="none" />
    <path d="M14,14 C14,20 20,24 24,20 C28,16 34,20 34,14" stroke="#d4a843" strokeWidth="2.5" fill="none" />
    <path d="M34,14 C34,8 40,4 44,8 C48,12 48,16 44,20 C40,24 34,20 34,14 Z" stroke="#d4a843" strokeWidth="2.5" fill="none" />
    <path d="M34,14 C34,8 28,4 24,8 C20,12 14,8 14,14" stroke="#d4a843" strokeWidth="2.5" fill="none" />
  </svg>,
  /* Awards Won - trophy/medal person */
  <svg viewBox="0 0 36 44" fill="#d4a843" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="7" r="6" fill="none" stroke="#d4a843" strokeWidth="2.5" />
    <line x1="18" y1="13" x2="18" y2="28" stroke="#d4a843" strokeWidth="2.5" />
    <line x1="8" y1="20" x2="28" y2="20" stroke="#d4a843" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="36" r="7" fill="none" stroke="#d4a843" strokeWidth="2.5" />
    <text x="18" y="40" textAnchor="middle" fill="#d4a843" fontSize="10" fontWeight="bold">1</text>
  </svg>,
];

/* Single animated DNA strand - positioned with CSS, not SVG viewBox */
const AnimatedDNA = ({ top, left, size, delay, speed }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      top, left,
      width: `${size}px`,
      height: `${size * 3}px`,
      animation: `dnaMove ${speed}s ease-in-out ${delay}s infinite`,
      zIndex: 1,
    }}
  >
    <svg width="100%" height="100%" viewBox="0 0 12 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M1,1 C1,6 11,8 11,13 C11,18 1,20 1,25 C1,30 11,32 11,35"
        fill="none" stroke="#9a8a3e" strokeWidth="1" strokeLinecap="round" opacity="0.8">
        <animate attributeName="d"
          values="M1,1 C1,6 11,8 11,13 C11,18 1,20 1,25 C1,30 11,32 11,35;
                  M1,1 C1,5 11,9 11,14 C11,19 1,19 1,24 C1,29 11,33 11,35;
                  M1,1 C1,6 11,8 11,13 C11,18 1,20 1,25 C1,30 11,32 11,35"
          dur={`${speed * 0.8}s`} repeatCount="indefinite" />
      </path>
      <path d="M11,1 C11,6 1,8 1,13 C1,18 11,20 11,25 C11,30 1,32 1,35"
        fill="none" stroke="#9a8a3e" strokeWidth="1" strokeLinecap="round" opacity="0.8">
        <animate attributeName="d"
          values="M11,1 C11,6 1,8 1,13 C1,18 11,20 11,25 C11,30 1,32 1,35;
                  M11,1 C11,5 1,9 1,14 C1,19 11,19 11,24 C11,29 1,33 1,35;
                  M11,1 C11,6 1,8 1,13 C1,18 11,20 11,25 C11,30 1,32 1,35"
          dur={`${speed * 0.8}s`} repeatCount="indefinite" />
      </path>
      <line x1="2" y1="4" x2="10" y2="4" stroke="#9a8a3e" strokeWidth="0.5" opacity="0.6" />
      <line x1="4" y1="9" x2="8" y2="9" stroke="#9a8a3e" strokeWidth="0.5" opacity="0.6" />
      <line x1="2" y1="17" x2="10" y2="17" stroke="#9a8a3e" strokeWidth="0.5" opacity="0.6" />
      <line x1="4" y1="22" x2="8" y2="22" stroke="#9a8a3e" strokeWidth="0.5" opacity="0.6" />
      <line x1="2" y1="29" x2="10" y2="29" stroke="#9a8a3e" strokeWidth="0.5" opacity="0.6" />
    </svg>
  </div>
);

const dnaList = [
  { top: '5%', left: '2%', size: 14, delay: 0, speed: 5 },
  { top: '35%', left: '1%', size: 12, delay: 1.5, speed: 6 },
  { top: '65%', left: '3%', size: 16, delay: 3, speed: 4.5 },
  { top: '10%', left: '12%', size: 10, delay: 0.8, speed: 7 },
  { top: '55%', left: '10%', size: 13, delay: 2.5, speed: 5.5 },
  { top: '5%', left: '24%', size: 11, delay: 4, speed: 6 },
  { top: '70%', left: '22%', size: 14, delay: 1, speed: 5 },
  { top: '8%', left: '38%', size: 12, delay: 3.5, speed: 7 },
  { top: '60%', left: '36%', size: 10, delay: 0.5, speed: 6 },
  { top: '3%', left: '50%', size: 13, delay: 2, speed: 5 },
  { top: '72%', left: '48%', size: 15, delay: 4.5, speed: 4.5 },
  { top: '6%', left: '63%', size: 11, delay: 1.2, speed: 6.5 },
  { top: '58%', left: '62%', size: 14, delay: 3.2, speed: 5 },
  { top: '10%', left: '76%', size: 12, delay: 0.3, speed: 7 },
  { top: '68%', left: '75%', size: 10, delay: 2.8, speed: 5.5 },
  { top: '4%', left: '88%', size: 15, delay: 1.8, speed: 4.5 },
  { top: '40%', left: '90%', size: 12, delay: 4.2, speed: 6 },
  { top: '70%', left: '92%', size: 14, delay: 0.7, speed: 5 },
  { top: '15%', left: '96%', size: 11, delay: 3.8, speed: 7 },
  { top: '80%', left: '50%', size: 13, delay: 2.2, speed: 5.5 },
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
    <section
      data-testid="stats-section"
      className="relative overflow-hidden"
      style={{ background: '#000000', padding: '80px 0' }}
    >
      {/* Animated DNA helixes */}
      {dnaList.map((d, i) => (
        <AnimatedDNA key={i} {...d} />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              {/* Icon */}
              <div className="mx-auto mb-4" style={{ width: '36px', height: '36px' }}>
                {statIcons[index]}
              </div>
              {/* Number with soft glow */}
              <div
                style={{
                  color: '#d4a843',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '3.2rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: '12px',
                  textShadow: '0 0 20px rgba(212,168,67,0.4), 0 0 50px rgba(212,168,67,0.2), 0 0 80px rgba(212,168,67,0.1)',
                }}
              >
                {stat.value}
              </div>
              {/* Label */}
              <div
                style={{
                  color: '#ffffff',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dnaMove {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.55; }
          25% { transform: translateY(-6px) rotate(5deg); opacity: 0.7; }
          50% { transform: translateY(-10px) rotate(0deg); opacity: 0.55; }
          75% { transform: translateY(-4px) rotate(-5deg); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
