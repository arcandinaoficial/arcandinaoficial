import React from 'react';
import Image from 'next/image';

const BannerSection = ({dict}) => {
  return (
    <section className='banner-section'>
        <Image
            className='banner-section__background'
            src="/banner-image.png" 
            alt="Imagen del océano con islas de fondo"
            width={1811} 
            height={1114} 
            priority 
        />
        <Image
            className='banner-section__characters'
            src="/banner-characters.png" 
            alt="Personajes de Arcandina"
            width={1554} 
            height={443} 
            priority 
        />
        <div className='banner-section__title'>
            <span>{dict.bannerText1}</span>
            <h1>{dict.bannerText2}</h1>
            <span>{dict.bannerText3}</span>
        </div>
    </section>
  );
};

export default BannerSection;
