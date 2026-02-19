'use client'

import { getDictionary } from '@/dictionaries/dictionaries.js';
import { usePathname } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import Button from "@/components/Button";
import {HeartCrack} from 'lucide-react';

export default function NotFound() {

  const pathname = usePathname();
  const [dict, setDict] = useState(null);

  let lang;
  if (pathname.startsWith('/es')) {
    lang = 'es';
  } else if (pathname.startsWith('/en') || pathname === '/') {
    lang = 'en';
  } else {
    lang = 'en';
  }

  useEffect(() => {
    let active = true;

    const loadDictionary = async () => {
      const loadedDict = await getDictionary(lang);
      if (active) {
        setDict(loadedDict);
      }
    };

    loadDictionary();

    return () => {
      active = false;
    };
  }, [lang]);

  if (!dict) {
    return null;
  }

  return (
    <div className='working-screen loading-screen not-found-page'>
      <HeartCrack color={'white'} size={80} />
      <h2>{dict.notFoundPageTitle}</h2>
      <p>{dict.notFoundPageDescription}</p>
      <Button 
          actionType="navigate"
          label={dict.notFoundPageRedirection}
          onClick={"/"}
          icon='House'
      />
    </div>
  );
}
