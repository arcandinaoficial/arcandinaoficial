import React from 'react';
import Image from 'next/image';

const TeamCard = ({imageSrc, title, description}) => {
  return (
    <div className='team-card'>
        <div className='team-card__image-wrapper'>
            <Image
                className='team-card__image'
                src={imageSrc} 
                alt={`Imagen de ${title}`}
                width={1200} 
                height={1200} 
                priority 
            />
        </div>
        <section className='team-card__text'>
            <h3>
                <span>{title?.split(" ")[0]}</span>
                <span>{title?.split(" ").slice(1).join(" ")}</span>
            </h3>
            <p>{description}</p>
        </section>
    </div>
  );
};

export default TeamCard;
