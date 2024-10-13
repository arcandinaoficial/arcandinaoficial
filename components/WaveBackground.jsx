'use client'

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WaveBackground = () => {
  const ref = useRef(null);

  // Track scroll position
  const { scrollYProgress } = useScroll();

  // Map scroll progress to background positions for both waves
  const backgroundX = useTransform(scrollYProgress, [0, 1], [0, -1000]); // First wave
  const backgroundXReverse = useTransform(scrollYProgress, [0, 1], [0, 1000]); // Second wave (opposite direction)

  return (
    <div className='rotary-section__waves' ref={ref}>
      {/* First wave */}
      <motion.div
        className="rotary-section__wave rotary-section__wave--light"
        style={{
          backgroundPositionX: backgroundX,
        }}
      />
      {/* Second wave (darker and opposite direction) */}
      <motion.div
        className="rotary-section__wave rotary-section__wave--dark"
        style={{
          backgroundPositionX: backgroundXReverse,
        }}
      />
    </div>
  );
};

export default WaveBackground;
