'use client';

import LoadingScreen from '@/screens/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preferredLang = navigator.language || navigator.userLanguage;

      if (preferredLang.startsWith('es')) {
        router.push('/es');
      } else {
        router.push('/en');
      }
    }
  }, [router]);

  return (
    <>
      <LoadingScreen />
    </>
  );
}
