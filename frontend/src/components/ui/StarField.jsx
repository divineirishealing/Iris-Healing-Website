import React, { useMemo } from 'react';

const StarField = ({ count = 30, color = '#D4AF37' }) => {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: color,
            opacity: 0,
            animation: `starFloat ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes starFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.8; transform: translateY(-20px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default StarField;
