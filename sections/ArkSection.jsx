'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useTransform, useScroll } from 'framer-motion';
import CharacterPin from '@/components/CharacterPin';
import CharacterMessage from '@/components/CharacterMessage';

const ArkSection = ({ dict }) => {
  const [arkImage, setArkImage] = useState('/ark.png');
  const { scrollY } = useScroll();
  const [visibleCharacter, setVisibleCharacter] = useState('');
  
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
