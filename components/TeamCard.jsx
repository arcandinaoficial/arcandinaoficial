'use client'

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const TeamCard = ({ imageSrc, title, description }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  // Parallax effect based on scroll position
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div className='team-card' ref={ref}>
      <motion.div
        className='team-card__image-wrapper'
        style={{ y: imageY }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
      >
        <Image
          className='team-card__image'
          src={imageSrc}
          alt={`Imagen de ${title}`}
          width={1200}
          height={1200}
          priority
        />
      </motion.div>
      <motion.section
        className='team-card__text'
        style={{ y: textY }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 25, delay: 0.4 }}
      >
        <h3>
          <span>{title?.split(' ')[0]}</span>
          <span>{title?.split(' ').slice(1).join(' ')}</span>
        </h3>
        <p>{description}</p>
      </motion.section>
    </div>
  );
};

export default TeamCard;
