'use client'

import React, {useState} from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Dialog } from 'primereact/dialog';
import { 
    House, 
    NotebookText, 
    Droplets,
    Compass 
} from 'lucide-react';
import NavbarLanguageButtons from './NavbarLanguageButtons';

const MenuButton = ({navbarItems, dict, params}) => {

    const [visible, setVisible] = useState(false);

    const getCorrespondingIcon = (iconName) => {
        switch (iconName){
            case 'NotebookText':
                return <NotebookText color={'white'} size={20} />;
            case 'Droplets':
                return <Droplets color={'white'} size={20} /> ;
            case 'Compass': 
                return <Compass color={'white'} size={20} /> ;
            default: 
                return <House color={'white'} size={20} /> ;
        }
    }

    const easeInOutCubic = (t) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    const handleScroll = (targetId) => {
        console.log(targetId);
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
        setVisible(false);
    };

    return (
        <>
            <Button onClick={() => setVisible(true)} actionType='function' iconSize={25} iconColor='#f58521' label={null} icon={'Menu'} className='navbar__burger-menu__button'/>
            {/* Diálogo de detalles */}
            <Dialog 
                position={'top-left'} 
                className='navbar__dialog' 
                header="" 
                visible={visible} 
                draggable={false} 
                onHide={() => setVisible(false)} 
                resizable={false}
                dismissableMask
            >
                <ul className='navbar__items navbar__items--dialog'>
                    {navbarItems.map((item, index) => (
                        <motion.li 
                            key={index}
                            initial={{ opacity: 0, y: -20 }} // Initial state of the animation
                            animate={{ opacity: 1, y: 0 }} // Final state of the animation
                            transition={{ delay: index * 0.1, duration: 0.3 }} // Stagger effect for each item
                        >
                            <div className='navbar__item--dialog' onClick={() => handleScroll(item.scrollTo)}>
                                {getCorrespondingIcon(item.icon)}
                                {item.text}
                            </div>
                        </motion.li>
                    ))}
                </ul>
                <div className='navbar__dialog__footer'>
                    <hr></hr>
                    <div className='navbar__dialog__footer__buttons'>
                        <Button 
                            label={dict.navbarButtonVisita} 
                            icon={'Ship'}
                            actionType='navigate'
                            onClick={`/${params.lang}/arcandina`}
                        />
                        {/* <Button 
                            label={dict.navbarButtonDona} 
                            variable='secondary' 
                            icon={'HeartHandshake'} 
                            onClick={{ severity: 'success', summary: dict.toasts.donationTitle, detail: dict.toasts.donationMessage }}
                            actionType="toast"
                        /> */}
                        <NavbarLanguageButtons dict={dict} params={params} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default MenuButton;
