'use client'

import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import { 
    Ship, 
    CircleDashed, 
    HeartHandshake,
    Menu,
    Clapperboard,
    Mic,
    BookOpenText,
    Lightbulb,
    House,
    CircleArrowLeft,
    Download
} from 'lucide-react';
import { Toast } from 'primereact/toast';

const Button = ({ 
    label, 
    onClick, 
    type = 'button', 
    className = '', 
    variable = 'primary',
    disabled = false,
    icon,
    iconColor = '#faf9f6', 
    iconSize = 18,
    actionType = ''
}) => {

    // ------------------ Setup -----------------------

    const toast = useRef(null);

    const iconsMap = {
        Ship: <Ship color={iconColor} size={iconSize} />,
        HeartHandshake: <HeartHandshake color={iconColor} size={iconSize} />,
        Menu: <Menu color={iconColor} size={iconSize} />,
        Clapperboard: <Clapperboard color={iconColor} size={iconSize} />,
        Mic: <Mic color={iconColor} size={iconSize} />,
        BookOpenText: <BookOpenText color={iconColor} size={iconSize} />,
        Lightbulb: <Lightbulb color={iconColor} size={iconSize} />,
        House: <House color={iconColor} size={iconSize} />,
        CircleArrowLeft: <CircleArrowLeft color={iconColor} size={iconSize} />,
        Download: <Download color={iconColor} size={iconSize} />,
        Rotary: <img style={{width: '18px', height: '18px'}} src="/socials/rotary-icon.svg" alt="Rotary nut icon"/>
    };

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

    // ------------------ Functions -----------------------

    const handleButtonClick = () => {
        if (actionType === 'redirect' && typeof onClick === 'string') {
            window.open(onClick, '_blank');
        } else if (actionType === 'navigate' && typeof onClick === 'string') {
            window.location.href = onClick; // Navigate in the same tab
        } else if (actionType === 'scrollTo' && typeof onClick === 'string') {
            handleScroll(onClick); // Scroll in the same tab
        } else if (actionType === 'toast') {
            toast.current.show({ 
                severity: onClick.severity, 
                summary: onClick.summary, 
                detail: onClick.detail
            });
        } else if (actionType === 'function' && typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <>
            <Toast ref={toast} appendTo={() => {document.body}}/>
            <button
                type={type}
                className={`button button--${variable} ${className}`}
                onClick={handleButtonClick}
                disabled={disabled}
                >
                    {label}
                    {icon ? (iconsMap[icon] || <CircleDashed color={iconColor} size={iconSize} />) : null}
            </button>
        </>
    );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  variable: PropTypes.string,
};

export default Button;
