'use client'

import React from 'react';

const NavbarItem = ({itemText}) => {
  return (
    <div onClick={() => console.log(itemText)}>
      {itemText}
    </div>
  );
};

export default NavbarItem;
