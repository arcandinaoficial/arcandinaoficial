'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const LinkText = ({ text, route }) => {
  const currentPath = usePathname();

  return (
    <Link href={`${currentPath}/${route}`}>
      <strong>{text}</strong>
    </Link>
  );
};

export default LinkText;
