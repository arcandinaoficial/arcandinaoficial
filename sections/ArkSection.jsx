'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';

const ArkSection = ({ dict }) => {
  const [arkImage, setArkImage] = useState('/ark.png');
  const { scrollY } = useScroll();

  // Parallax rotation effect
  const rotate = useMotionValue(0);
  
  // Create a back-and-forth oscillation effect for rotation using sine wave
  const rotateTransform = useTransform(scrollY, (value) => {
    return Math.sin(value / 80) * 5;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setArkImage('/ark-rotated.png');
      } else {
        setArkImage('/ark.png');
      }
    };

    // Call resize handler once on component mount
    handleResize();

    // Set up window resize listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='ark-section__background'>
      <section className='ark-section'>
        <div className='ark-section__content'>
          <div className='ark-section__text'>
            <h2>{dict.arkText1}</h2>
            <p>{dict.arkText2}</p>
            <span>{dict.arkText3}</span>
          </div>
          
          <motion.div 
            className='ark-section__ilustration'
            style={{ rotate: rotateTransform }}  // Apply the smooth back-and-forth rotation effect
          >
            <Image
              className='ark-section__ilustration__image'
              src="/ark-ilustration.png"
              alt="Dibujo del arcandina con sus personajes"
              width={1264}
              height={1071}
              priority
            />
          </motion.div>
        </div>
        
        <div className='ark-section__ark'>
          <Image
            className='ark-section__ark__image'
            src={arkImage}
            alt="Dibujo de un arca"
            width={arkImage === '/ark.png' ? 1692 : 636}
            height={arkImage === '/ark.png' ? 636 : 1692}
            priority
          />
        </div>
      </section>
    </div>
  );
};

export default ArkSection;
