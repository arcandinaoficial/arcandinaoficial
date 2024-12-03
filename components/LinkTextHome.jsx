'use client'

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const easeInOutCubic = (t) => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const handleScroll = () => {
  const startY = window.scrollY;
  const targetY = 0; // Scroll to the top
  const distance = targetY - startY;
  const duration = 1000; // 1 second scroll duration
  let startTime = null;

  const scrollAnimation = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
    }
  };

  requestAnimationFrame(scrollAnimation);
};

const LinkTextHome = ({ text }) => {
  const currentPath = usePathname();
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    
    // Check if the path is exactly '/en' or '/es'
    if (currentPath === '/en' || currentPath === '/es') {
      // Scroll to the top if in root language path
      handleScroll();
    } else {
      // Redirect to root language path if in a subpath
      const rootPath = currentPath.startsWith('/es') ? '/es' : '/en';
      router.push(rootPath);
    }
  };

  return (
    <button onClick={handleClick} style={{ all: 'unset', cursor: 'pointer' }}>
      <strong>{text}</strong>
    </button>
  );
};

export default LinkTextHome;
