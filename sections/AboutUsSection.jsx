import LinkText from '@/components/LinkText';
import TeamCard from '@/components/TeamCard';
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
        
        <span className='aboutus-section__content-title'>
            {dict.aboutUsText6}
        </span>
        <div className='aboutus-section__creators'>
            <TeamCard imageSrc={'/maria-elena-ordonez-img.jpg'} title={'María Elena Ordoñez'} description={dict.mariaElenaDescription}/>
            <TeamCard imageSrc={'/pablo-palacios-img.jpg'} title={'Pablo Palacios Naranjo'} description={dict.pabloDescription}/>
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
