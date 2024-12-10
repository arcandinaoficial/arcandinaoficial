import LinkText from '@/components/LinkText';
import WindowCarousel from '@/components/WindowCarousel';
import React from 'react';
import Image from '@/components/Image';

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
                    <Image className='aboutus-section__description__image' srcWebp='/suitcase-image.webp' srcPng='/suitcase-image.png' alt='An image of a travelling suitcase'/>
                </div>
            </div>
            <Image className='aboutus-section__banderines' srcWebp='/banderines-image.webp' srcPng='/banderines-image.png' alt='An image of some flags on a rope'/>
            <Image className='aboutus-section__banderines--small' srcWebp='/banderines-image-small.webp' srcPng='/banderines-image-small.png' alt='An image of some flags on a rope'/>
        </div>
        <div className='aboutus-section__logos'>
            <Image className='aboutus-section__logos--arcandina' srcWebp='/arcandina-logo-image.webp' srcPng='/arcandina-logo-image.png' alt='Arcandina logo'/>
            <Image className='aboutus-section__logos--rotary' srcWebp='/rotary-logo-image.webp' srcPng='/rotary-logo.png' alt='Rotary logo'/>
        </div>
        <h3 className='aboutus-section__title--second'>
            <span>{dict.aboutUsText6}</span>
            <span>{dict.aboutUsText7}</span>
        </h3>
        <div className='aboutus-section__text' style={{paddingBottom: '40px'}}>
            <div className='aboutus-section__shelf'>
                <div className='aboutus-section__description aboutus-section__description--reversed'>
                    <div className='aboutus-section__description__overlay'></div>
                    <Image className='aboutus-section__description__image' srcWebp='/characters/cori.webp' srcPng='/characters/cori.png' alt='An image of our character Cori'/>
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
