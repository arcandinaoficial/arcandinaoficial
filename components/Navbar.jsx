import React from 'react';
import NavbarItem from './NavbarItem';
import Button from './Button';
import Image from 'next/image';
import MenuButton from './MenuButton';
import LinkTextHome from './LinkTextHome';
import NavbarLanguageButtons from './NavbarLanguageButtons';
import { Tooltip } from 'primereact/tooltip';

const Navbar = ({ dict, params }) => {

    // ------------- Setup ------------------------

    const navbarItems = [
        {
            'text': dict.navbarItem1,
            'scrollTo': 'AboutUsSection',
            'icon': 'House',
            'showOnExpand': true
        },
        {
            'text': dict.navbarButtonHistorias,
            'scrollTo': 'ContentSection',
            'icon': 'Droplets',
            'showOnExpand': false
        },
        {
            'text': dict.navbarItem2,
            'scrollTo': 'JournalSection',
            'icon': 'NotebookText',
            'showOnExpand': true
        },
        {
            'text': dict.navbarItem3,
            'scrollTo': 'ArkSection',
            'icon': 'Compass',
            'showOnExpand': true
        }
    ]

    return (
        <nav className='navbar'>
            <Tooltip target="#es-msg" />
            <Tooltip target="#en-msg" />
            <div className='navbar__logo-container'>
                <Image
                    className='navbar__logo'
                    src="/logo-arcandina.png"
                    alt="Logo de Arcandina"
                    width={110}
                    height={69}
                    priority
                />
                <LinkTextHome />
            </div>
            <ul className='navbar__items'>
                {navbarItems.map((item, index) => (
                    item.showOnExpand ? (
                        <li key={index}>
                            {item.text}
                            <NavbarItem targetId={item.scrollTo} />
                        </li>
                    ) : null
                ))}
            </ul>
            <div className='navbar__buttons'>
                <Button
                    label={dict.navbarButtonHistorias}
                    icon={'Rotary'}
                    actionType='scrollTo'
                    onClick={'ContentSection'}
                    variable='rotary'
                />
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
            <div className='navbar__burger-menu'>
                <MenuButton navbarItems={navbarItems} dict={dict} params={params} />
            </div>
        </nav>
    );
};

export default Navbar;
