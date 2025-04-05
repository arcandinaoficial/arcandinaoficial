'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from '@/components/Image';

const BannerSection = ({ dict }) => {
    return (
        <section className="banner-section">
            <motion.div
                className="banner-section__background__container"
                animate={{ x: ['-1%', '1%', '-1%'] }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            >
                <Image
                    className='banner-section__background'
                    srcWebp="/banner-image.webp"
                    srcJpg="/banner-image.jpg"
                    alt="Imagen del océano con islas de fondo"
                />
            </motion.div>

            <motion.div
                className="banner-section__characters__container"
                animate={{ x: ['2%', '-2%', '2%'] }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            >
                <Image
                    className="banner-section__characters"
                    srcWebp="/banner-characters.webp"
                    srcPng="/banner-characters.png"
                    alt="Personajes de Arcandina"
                />
            </motion.div>

            <div className='banner-section__title'>
                <span>{dict.bannerText1}</span>
                <h1>{dict.bannerText2}</h1>
            </div>
        </section>
    );
};

export default BannerSection;
