'use client'

import React, {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Dialog } from 'primereact/dialog';
import { 
    Info, 
    Handshake, 
    Clapperboard,
    Compass 
} from 'lucide-react';

const MenuButton = ({navbarItems, dict}) => {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            document.documentElement.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
        }
    }, [visible]);

    const getCorrespondingIcon = (iconName) => {
        switch (iconName){
            case 'Handshake':
                return <Handshake color={'white'} size={20} />;
            case 'Clapperboard':
                return <Clapperboard color={'white'} size={20} /> ;
            case 'Compass': 
                return <Compass color={'white'} size={20} /> ;
            default: 
                return <Info color={'white'} size={20} /> ;
        }
    }

    return (
        <>
            <Button onClick={() => setVisible(true)} iconSize={25} iconColor='#f58521' label={null} icon={'Menu'} className='navbar__burger-menu__button'/>
            {/* Diálogo de detalles */}
            <Dialog position={'top-left'} className='navbar__dialog' header="" visible={visible} draggable={false} onHide={() => setVisible(false)} >
                <ul className='navbar__items navbar__items--dialog'>
                    {navbarItems.map((item, index) => (
                        <motion.li 
                            key={index}
                            initial={{ opacity: 0, y: -20 }} // Initial state of the animation
                            animate={{ opacity: 1, y: 0 }} // Final state of the animation
                            transition={{ delay: index * 0.1, duration: 0.3 }} // Stagger effect for each item
                        >
                            <div className='navbar__item--dialog'>
                                {getCorrespondingIcon(item.icon)}
                                {item.text}
                            </div>
                        </motion.li>
                    ))}
                </ul>
                <div className='navbar__dialog__footer'>
                    <hr></hr>
                    <div className='navbar__dialog__footer__buttons'>
                        <Button label={dict.navbarButtonVisita} icon={'Ship'}/>
                        <Button label={dict.navbarButtonDona} variable='secondary' icon={'HeartHandshake'}/>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default MenuButton;
