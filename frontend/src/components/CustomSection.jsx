import React from 'react';
import { HEADING, BODY, CONTAINER, applySectionStyle } from '../lib/designTokens';
import { renderMarkdown } from '../lib/renderMarkdown';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('/api/image/')) return `${BACKEND_URL}${url}`;
  return url;
}

const CustomSection = ({ sectionConfig }) => {
  if (!sectionConfig) return null;
  const { title, subtitle, title_style, subtitle_style, image_url, body_text, body_style } = sectionConfig;
  const hasImage = !!image_url;
  const hasBody = !!body_text;

  return (
    <section data-testid={`custom-section-${sectionConfig.id}`} className="py-12 bg-white">
      <div className={CONTAINER}>
        <div className="text-center mb-8">
          {title && (
            <h2 className="mb-3" style={applySectionStyle(title_style, { ...HEADING, fontSize: 'clamp(1.5rem, 3vw, 2rem)' })}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-500 text-sm max-w-2xl mx-auto"
              style={applySectionStyle(subtitle_style, {})}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(subtitle) }} />
          )}
        </div>

        {(hasImage || hasBody) && (
          <div className={`max-w-5xl mx-auto ${hasImage && hasBody ? 'grid md:grid-cols-2 gap-10 items-center' : ''}`}>
            {hasImage && (
              <div className={!hasBody ? 'max-w-3xl mx-auto' : ''}>
                <img
                  src={resolveUrl(image_url)}
                  alt={title || 'Section image'}
                  className="w-full rounded-lg object-cover"
                  style={{ maxHeight: '450px' }}
                  data-testid={`custom-section-image-${sectionConfig.id}`}
                />
              </div>
            )}
            {hasBody && (
              <div className={!hasImage ? 'max-w-3xl mx-auto' : ''}>
                <div
                  style={applySectionStyle(body_style, { ...BODY })}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(body_text) }}
                  data-testid={`custom-section-body-${sectionConfig.id}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomSection;
