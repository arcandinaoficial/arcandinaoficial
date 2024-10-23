'use client';

import React from 'react';
import Image from 'next/image';
import WaveBackground from '@/components/WaveBackground';
import CurvyCarousel from '@/components/CurvyCarousel';
import ContentDiplayer from '@/components/ContentDisplayer';

const RotarySection = ({ dict }) => {
  return (
    <section className='rotary-section'>
      <WaveBackground />
      <h2 className='rotary-section__title'>
        <span className="rotary-section__arcandina-logo">
          <Image 
            src="/ark-logo.png" 
            alt="Arcandina Logo" 
            width={909} 
            height={431} 
            priority 
          />
          arcandina
        </span>
        <span> & </span>
        <span className="rotary-section__rotary-logo">
          Rotary
          <Image 
            src="/rotary-logo.png" 
            alt="Rotary Logo" 
            width={862} 
            height={267} 
            priority 
          />
        </span>
      </h2>
      <p className='rotary-section__description'>{dict.rotaryText1}</p>
      <div className='rotary-section__carousel'> 
        <CurvyCarousel />
      </div>
      <h2 className='rotary-section__content-title'>
          <span>{dict.rotaryText2}</span>
          <span>{dict.rotaryText3}</span>
      </h2>
      <p className='rotary-section__description'>{dict.rotaryText4}</p>
      <ContentDiplayer dict={dict} />
      <p className='aboutus-section__arca-redirect'> 
          {dict.rotaryText5} 
          <br/> 
          <a href="https://example.com">
              <strong>{dict.visitTheArk}</strong>
          </a>
      </p>
    </section>
  );
};

export default RotarySection;
