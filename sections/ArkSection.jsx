import React from 'react';
import Image from 'next/image';

const ArkSection = ({dict}) => {
  return (
    <section className='ark-section'>
        <div className='ark-section__content'>
            <div className='ark-section__text'>
                <h2>{dict.arkText1}</h2>
                <p>{dict.arkText2}</p>
                <span>{dict.arkText3}</span>
            </div>
            <div className='ark-section__ilustration'>
                <Image
                    className='ark-section__ilustration__image'
                    src="/ark-ilustration.png" 
                    alt="Dibujo del arcandina con sus personajes"
                    width={1264} 
                    height={1071} 
                    priority 
                />
            </div>
        </div>
        <div className='ark-section__ark'>
            <Image
                className='ark-section__ark__image'
                src="/ark.png" 
                alt="Dibujo de un arca"
                width={1692} 
                height={636} 
                priority 
            />
        </div>
    </section>
  );
};

export default ArkSection;
