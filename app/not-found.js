'use client'

import Link from "next/link";
import { getDictionary } from '@/dictionaries/dictionaries.js';
import { usePathname } from 'next/navigation'; 

export default async function NotFound() {

  const pathname = usePathname();

  let lang;
  if (pathname.startsWith('/es')) {
    lang = 'es';
  } else if (pathname.startsWith('/en') || pathname === '/') {
    lang = 'en';
  } else {
    lang = 'en';
  }

  const dict = await getDictionary(lang);

  return (
    <div className='not-found-page'>
      <h2>{dict.notFoundPageTitle}</h2>
      <p>{dict.notFoundPageDescription}</p>
      <Link href="/">{dict.notFoundPageRedirection}</Link>
    </div>
  );
}
