'use client';

import React from 'react';

const ClickableItem = ({ onClick, children, actionType, className = '' }) => {

    const easeInOutCubic = (t) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    const handleScroll = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
    
        const startY = window.scrollY;
        const targetY = targetElement.getBoundingClientRect().top + startY - 100;
        const distance = targetY - startY;
        const duration = 2000; // 1 second scroll duration
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

    const handleClick = () => {
        if (actionType === 'redirect' && typeof onClick === 'string') {
            window.open(onClick, '_blank');
        } else if (actionType === 'navigate' && typeof onClick === 'string') {
            window.location.href = onClick; // Navigate in the same tab
        } else if(actionType === 'scrollTo' && typeof onClick === 'string'){
            handleScroll(onClick);
        } else if (actionType === 'function' && typeof onClick === 'function') {
            onClick();
        }
    }; 

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }} className={className}>
            {children}
        </div>
    );
};

export default ClickableItem;
