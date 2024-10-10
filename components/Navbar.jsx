import React from 'react';
import NavbarItem from './NavbarItem';
import Button from './Button';
import Image from 'next/image';

const Navbar = ({dict}) => {

  const navbarItems = [
    {
      'text': dict.navbarItem1,
      'scrollTo': '50px'
    },
    {
      'text': dict.navbarItem2,
      'scrollTo': '150px'
    },
    {
      'text': dict.navbarItem3,
      'scrollTo': '250px'
    },
    {
      'text': dict.navbarItem4,
      'scrollTo': '350px'
    }
  ]

  return (
    <nav className='navbar'>
      <Image
          className='navbar__logo'
          src="/logo-arcandina.png" 
          alt="Logo de Arcandina"
          width={110} 
          height={69} 
          priority 
      />
      <ul className='navbar__items'>
        {navbarItems.map((item, index) => (
          <li key={index}>
            {item.text}
            <NavbarItem href={item.action} />
          </li>
        ))}
      </ul>
      <div className='navbar__buttons'>
        <Button label={dict.navbarButtonVisita} icon={'Ship'}/>
        <Button label={dict.navbarButtonDona} variable='secondary' icon={'HeartHandshake'}/>
      </div>
    </nav>
  );
};

export default Navbar;
