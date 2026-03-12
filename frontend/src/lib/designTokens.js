/* =====================================================
   DIVINE IRIS — Global Design Tokens
   All pages use these consistently.
   ===================================================== */

/* Cinzel Bold - all section headings */
export const HEADING = {
  fontFamily: "'Cinzel', serif",
  fontWeight: 700,
  color: '#1a1a1a',
};

/* Lato small - subtitles, labels, small caps */
export const SUBTITLE = {
  fontFamily: "'Lato', sans-serif",
  fontWeight: 300,
  color: '#999',
  fontSize: '0.85rem',
};

/* Lato - body text for programs, sessions, all content */
export const BODY = {
  fontFamily: "'Lato', sans-serif",
  fontWeight: 400,
  color: '#555',
  fontSize: '0.9rem',
  lineHeight: '1.85',
};

/* Gold accent */
export const GOLD = '#D4AF37';
export const GOLD_DARK = '#b8962e';

/* Label (uppercase tracking) */
export const LABEL = {
  fontFamily: "'Lato', sans-serif",
  fontWeight: 600,
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: GOLD,
};

/* Page container max-width + padding */
export const CONTAINER = 'container mx-auto px-6 md:px-8 lg:px-12';
export const NARROW = 'max-w-4xl mx-auto';
export const WIDE = 'max-w-5xl mx-auto';

/* Section spacing */
export const SECTION_PY = 'py-20';


/** Apply section config style overrides */
export const applySectionStyle = (styleObj, defaults = {}) => {
  if (!styleObj || Object.keys(styleObj).length === 0) return defaults;
  return {
    ...defaults,
    ...(styleObj.font_family && { fontFamily: styleObj.font_family }),
    ...(styleObj.font_size && { fontSize: styleObj.font_size }),
    ...(styleObj.font_color && { color: styleObj.font_color }),
    ...(styleObj.font_weight && { fontWeight: styleObj.font_weight }),
    ...(styleObj.font_style && { fontStyle: styleObj.font_style }),
  };
};
