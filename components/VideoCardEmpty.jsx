'use client'

import React from 'react';
import { CircleFadingPlus } from 'lucide-react';

const VideoCardEmpty = ({className = '', dict }) => {
  return (
    <div className={`video-card--empty ${className}`}>
      <CircleFadingPlus color={'#ffffff'} size={50} />
      <h5 className="video-card--empty__title">{dict.emptyVideoCardTitle}</h5>
      <p className="video-card--empty__description">{dict.emptyVideoCardDescription}</p>
      <ul className="video-card--empty__socials">
          <li>
          <a href="https://www.facebook.com/redarcandina" target="_blank" rel="noopener noreferrer">
              <img src="/socials/facebook-icon.svg" alt="Facebook" />
          </a>
          </li>
          <li>
          <a href="https://www.instagram.com/arcandina_fundacion" target="_blank" rel="noopener noreferrer">
              <img src="/socials/instagram-icon.svg" alt="Instagram" />
          </a>
          </li>
          <li>
          <a href="https://www.youtube.com/@arcandinaoficial4280" target="_blank" rel="noopener noreferrer">
              <img src="/socials/youtube-icon.svg" alt="YouTube" />
          </a>
          </li>
      </ul>
    </div>
  );
};

export default VideoCardEmpty;
