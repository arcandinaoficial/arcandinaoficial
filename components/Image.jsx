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
  const fallbackSrc = srcJpg || srcPng; 

  return (
    <picture style={{display: 'contents'}}>
        {srcWebp && <source style={{display: 'contents'}} srcSet={srcWebp} type="image/webp" />}
        
        {fallbackSrc && <source style={{display: 'contents'}} srcSet={fallbackSrc} type="image/jpeg" />}

        <img
            src={fallbackSrc} 
            alt={alt}
            className={className}
            style={style}
            width={width}
            height={height}
            {...props}
        />
    </picture>
  );
}
