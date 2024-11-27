'use client';

import React from 'react';
import WaveBackground from '@/components/WaveBackground';
import CurvyCarousel from '@/components/CurvyCarousel';
import ContentDiplayer from '@/components/ContentDisplayer';
import LinkText from '@/components/LinkText';

const RotarySection = ({ dict }) => {
  return (
    <section className='rotary-section'>
      <WaveBackground />
      <div className='rotary-section__carousel'> 
        <CurvyCarousel />
      </div>
      <h2 className='rotary-section__content-title' id='ContentSection'>
          <span>{dict.rotaryText2}</span>
          <span>{dict.rotaryText3}</span>
      </h2>
      <ContentDiplayer dict={dict} />
      <p className='aboutus-section__arca-redirect'> 
          {dict.rotaryText5} 
          <br/> 
          <LinkText text={dict.visitTheArk} route={'arcandina'}/>
      </p>
    </section>
  );
};

export default RotarySection;
