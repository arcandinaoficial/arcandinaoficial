import LinkText from '@/components/LinkText';
import WindowCarousel from '@/components/WindowCarousel';
import React from 'react';

const AboutUsSection = ({dict}) => {
  return (
    <section className='aboutus-section'>
        <h2 className='aboutus-section__title' id='AboutUsSection'>
            <span>{dict.aboutUsText1}</span>
            <span>{dict.aboutUsText2}</span>
        </h2>
        <div className='aboutus-section__text'>
            <div className='aboutus-section__shelf'>
                <div className='aboutus-section__description'>
                    <div className='aboutus-section__description__overlay'></div>
                    <p className='aboutus-section__description__text'>{dict.aboutUsText3}</p>
                    <img className='aboutus-section__description__image' src='/suitcase-image.webp' alt='An image of a travelling suitcase'></img>
                </div>
            </div>
            <img className='aboutus-section__banderines' src='/banderines-image.webp' alt='An image of some flags on a rope'></img>
            <img className='aboutus-section__banderines--small' src='/banderines-image-small.webp' alt='An image of some flags on a rope'></img>
        </div>
        <div className='aboutus-section__logos'>
            <img className='aboutus-section__logos--arcandina' src='/arcandina-logo-image.webp' alt='Arcandina logo'></img>
            <img className='aboutus-section__logos--rotary' src='/rotary-logo-image.webp' alt='Rotary logo'></img>
        </div>
        <h3 className='aboutus-section__title--second'>
            <span>{dict.aboutUsText6}</span>
            <span>{dict.aboutUsText7}</span>
        </h3>
        <div className='aboutus-section__text' style={{paddingBottom: '40px'}}>
            <div className='aboutus-section__shelf'>
                <div className='aboutus-section__description aboutus-section__description--reversed'>
                    <div className='aboutus-section__description__overlay'></div>
                    <img className='aboutus-section__description__image' src='/characters/cori.webp' alt='An image of a travelling suitcase'></img>
                    <p className='aboutus-section__description__text'>
                        {dict.aboutUsText8}
                        <br></br>  <br></br>
                        {dict.aboutUsText9}
                    </p>
                </div>
            </div>
        </div>
        <span className='aboutus-section__content-title'>
            {dict.aboutUsText4}
        </span>
        <div className='aboutus-section__carousel'>
            <WindowCarousel />
        </div>
        <p className='aboutus-section__arca-redirect'> 
            {dict.aboutUsText5} 
            <br/> 
            <LinkText text={dict.visitTheArk} route={'arcandina'}/>
        </p>
    </section>
  );
};

export default AboutUsSection;
