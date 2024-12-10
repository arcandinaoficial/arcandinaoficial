import React from 'react';

export default function Image({
  srcWebp,  // Source for WebP
  srcPng,   // Source for PNG
  srcJpg,   // Source for JPG
  alt = '', // Alternative text
  className = '', // CSS class names
  style = {}, // Inline styles
  width, // Image width
  height, // Image height
  ...props // Any additional props
}) {
  return (
    <img
        src={srcJpg || srcPng} // Fallback to JPG or PNG
        srcSet={`
            ${srcWebp ? `${srcWebp} 1x, ` : ''}
            ${srcJpg ? `${srcJpg} 1x, ` : ''}
            ${srcPng ? `${srcPng} 1x` : ''}
        `.trim()}
        alt={alt}
        className={className}
        style={style}
        width={width}
        height={height}
        {...props}
    />
  );
}
