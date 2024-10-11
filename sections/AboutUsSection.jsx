import WindowCarousel from '@/components/WindowCarousel';
import React from 'react';

const AboutUsSection = ({dict}) => {
  return (
    <section className='aboutus-section'>
        <h2 className='aboutus-section__title'>
            <span>{dict.aboutUsText1}</span>
            <span>{dict.aboutUsText2}</span>
        </h2>
        <p className='aboutus-section__description'>
            {dict.aboutUsText3}
        </p>
        <span className='aboutus-section__content-title'>
            {dict.aboutUsText4}
        </span>
        <div className='aboutus-section__carousel'>
            <WindowCarousel />
        </div>
        <p className='aboutus-section__arca-redirect'> 
            {dict.aboutUsText5} 
            <br/> 
            <a href="https://example.com">
                <strong>{dict.visitTheArk}</strong>
            </a>
        </p>
    </section>
  );
};

export default AboutUsSection;
