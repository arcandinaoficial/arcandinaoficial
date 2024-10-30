import React from 'react';
import NavbarItem from './NavbarItem';
import Button from './Button';
import Image from 'next/image';
import MenuButton from './MenuButton';

const Navbar = ({dict}) => {

  const navbarItems = [
      {
        'text': dict.navbarItem1,
        'scrollTo': 'AboutUsSection',
        'icon': 'Info'
      },
      {
        'text': dict.navbarItem2,
        'scrollTo': 'RotarySection',
        'icon': 'Handshake'
      },
      {
        'text': dict.navbarItem3,
        'scrollTo': 'ContentSection',
        'icon': 'Clapperboard'
      },
      {
        'text': dict.navbarItem4,
        'scrollTo': 'ArkSection',
        'icon': 'Compass'
      }
  ]

  return (
    <nav className='navbar'>
      <Image
          className='navbar__logo'
          src="./logo-arcandina.png" 
          alt="Logo de Arcandina"
          width={110} 
          height={69} 
          priority 
      />
      <ul className='navbar__items'>
        {navbarItems.map((item, index) => (
          <li key={index}>
            {item.text}
            <NavbarItem targetId={item.scrollTo} />
          </li>
        ))}
      </ul>
      <div className='navbar__buttons'>
        <Button label={dict.navbarButtonVisita} icon={'Ship'}/>
        <Button label={dict.navbarButtonDona} variable='secondary' icon={'HeartHandshake'} onClick="https://www.gofundme.com" actionType="redirect"/>
      </div>
      <div className='navbar__burger-menu'>
        <MenuButton navbarItems={navbarItems} dict={dict}/>
      </div>
    </nav>
  );
};

export default Navbar;
