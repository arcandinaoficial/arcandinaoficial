'use client'

import React from 'react';
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
    CircleArrowLeft
} from 'lucide-react';

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
    };

    const handleButtonClick = () => {
        if (actionType === 'redirect' && typeof onClick === 'string') {
            window.open(onClick, '_blank');
        } else if (actionType === 'navigate' && typeof onClick === 'string') {
            window.location.href = onClick; // Navigate in the same tab
        } else if (actionType === 'function' && typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <button
        type={type}
        className={`button button--${variable} ${className}`}
        onClick={handleButtonClick}
        disabled={disabled}
        >
        {label}
        {icon ? (iconsMap[icon] || <CircleDashed color={iconColor} size={iconSize} />) : null}
        </button>
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
