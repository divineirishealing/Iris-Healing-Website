import React from 'react';

const GoldenWaveBackground = ({ children, className = '', intensity = 'medium' }) => {
  const opacities = { light: '0.08', medium: '0.15', strong: '0.25' };
  const opacity = opacities[intensity] || opacities.medium;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated wave layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute bottom-0 w-full" style={{ height: '120px' }} viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z"
            fill={`rgba(212, 175, 55, ${opacity})`}
            style={{ animation: 'waveShift 8s ease-in-out infinite' }}
          />
          <path
            d="M0,80 C240,40 480,100 720,60 C960,20 1200,80 1440,40 L1440,120 L0,120 Z"
            fill={`rgba(212, 175, 55, ${parseFloat(opacity) * 0.6})`}
            style={{ animation: 'waveShift 12s ease-in-out infinite reverse' }}
          />
        </svg>
        {/* Top subtle shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.03) 50%, transparent 100%)',
            animation: 'shimmer 6s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes waveShift {
          0%, 100% { d: path("M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z"); }
          50% { d: path("M0,80 C360,20 720,100 1080,40 C1260,70 1380,50 1440,80 L1440,120 L0,120 Z"); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GoldenWaveBackground;
