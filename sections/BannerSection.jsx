import React from 'react';
import Image from '@/components/Image';

const BannerSection = ({dict}) => {
  return (
    <section className='banner-section'>
        <Image
            className='banner-section__background'
            srcWebp="/banner-image.webp" 
            srcJpg="/banner-image.jpg" 
            alt="Imagen del océano con islas de fondo"
            width={1811} 
            height={1114} 
        />
        <Image
            className='banner-section__characters'
            srcWebp="/banner-characters.webp"
            srcPng="/banner-characters.png" 
            alt="Personajes de Arcandina"
            width={1554} 
            height={443} 
        />
        <div className='banner-section__title'>
            <span>{dict.bannerText1}</span>
            <h1>{dict.bannerText2}</h1>
        </div>
    </section>
  );
};

export default BannerSection;
