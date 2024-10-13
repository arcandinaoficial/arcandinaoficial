'use client';

import React from 'react';
import Image from 'next/image';
import WaveBackground from '@/components/WaveBackground';
import CurvyCarousel from '@/components/CurvyCarousel';

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
      <div className='rotary-section__description'>
        <p>{dict.rotaryText1}</p>
      </div>
      <div className='rotary-section__carousel'> 
        <CurvyCarousel />
      </div>
    
    </section>
  );
};

export default RotarySection;
