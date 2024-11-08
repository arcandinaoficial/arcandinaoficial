'use client'

import { getDictionary } from '@/dictionaries/dictionaries.js';
import { usePathname } from 'next/navigation'; 
import Button from "@/components/Button";

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
    <div className='working-screen loading-screen not-found-page'>
      <h2>{dict.notFoundPageTitle}</h2>
      <p>{dict.notFoundPageDescription}</p>
      <Button 
          actionType="navigate"
          variable="secondary"
          label={dict.notFoundPageRedirection}
          onClick={"/"}
          icon='House'
      />
    </div>
  );
}
