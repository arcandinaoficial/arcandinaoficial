'use client'

import React from 'react';
import PropTypes from 'prop-types';
import { 
    Ship, 
    CircleDashed, 
    HeartHandshake,
    Menu 
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
    iconSize = 18
}) => {

    const iconsMap = {
        Ship: <Ship color={iconColor} size={iconSize} />,
        HeartHandshake: <HeartHandshake color={iconColor} size={iconSize} />,
        Menu: <Menu color={iconColor} size={iconSize} />,
    };

    return (
        <button
        type={type}
        className={`button button--${variable} ${className}`}
        onClick={onClick}
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
