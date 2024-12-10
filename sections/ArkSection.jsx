'use client'

import React, { useEffect, useState } from 'react';
import Image from '@/components/image';
import { motion, useTransform, useScroll } from 'framer-motion';
import CharacterPin from '@/components/CharacterPin';
import CharacterMessage from '@/components/CharacterMessage';

const ArkSection = ({ dict }) => {
  const [arkImage, setArkImage] = useState('/ark.webp');
  const { scrollY } = useScroll();
  const [visibleCharacter, setVisibleCharacter] = useState('');
  
  const rotateTransform = useTransform(scrollY, (value) => {
    return Math.sin(value / 80) * 5;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setArkImage('/ark-rotated.webp');
      } else {
        setArkImage('/ark.webp');
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

  const handlePinClick = (character) => (event) => {
    event.stopPropagation(); 
    setVisibleCharacter(character);
  };

  return (
    <div className='ark-section__background' onClick={() => setVisibleCharacter('')}>
      <section className='ark-section'>
        <div className='ark-section__content' id='ArkSection'>
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
              srcWebp="/ark-ilustration.webp"
              srcPng="/ark-ilustration.png"
              alt="Dibujo del arcandina con sus personajes"
              width={1264}
              height={1071}
            />
          </motion.div>
        </div>
        
        <div className='ark-section__ark'>
          <Image
            className='ark-section__ark__image'
            srcWebp={arkImage}
            srcPng={arkImage === '/ark.webp' ? '/ark.png' : '/ark-rotated.png'}
            alt="Dibujo de un arca"
            width={arkImage === '/ark.webp' ? 1692 : 636}
            height={arkImage === '/ark.webp' ? 636 : 1692}
          />
          <CharacterPin characterName={'cori'} action={handlePinClick('cori')}/>
          <CharacterPin characterName={'jagui'} action={handlePinClick('jagui')}/>
          <CharacterPin characterName={'antonella'} action={handlePinClick('antonella')}/>
          <CharacterPin characterName={'tucan'} action={handlePinClick('tucan')}/>
          <CharacterPin characterName={'guardian'} action={handlePinClick('guardian')}/>
          {/* <CharacterPin characterName={'ratasura'}/> */}
        </div>
      </section>

      <CharacterMessage characterName={'cori'} dict={dict} visible={visibleCharacter === 'cori'}/>
      <CharacterMessage characterName={'jagui'} dict={dict} visible={visibleCharacter === 'jagui'}/>
      <CharacterMessage characterName={'antonella'} dict={dict} visible={visibleCharacter === 'antonella'}/>
      <CharacterMessage characterName={'tucan'} dict={dict} visible={visibleCharacter === 'tucan'}/>
      <CharacterMessage characterName={'guardian'} dict={dict} visible={visibleCharacter === 'guardian'}/>
    </div>
  );
};

export default ArkSection;
