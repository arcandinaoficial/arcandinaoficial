'use client';

import LoadingScreen from '@/screens/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Head from 'next/head';

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
      <Head>
        <title>Arcandina Oficial | Educación ambiental para niños</title>
        <meta name="description" content="Arcandina es el portal educativo líder en educación ambiental para niños, ofreciendo material audiovisual interactivo sobre la conservación del Río San Pedro, y la importancia de las buenas prácticas ambientales. Descubre a personajes como Jagui, Cori, Ratasura, Tucán y Guardián Verde, quienes acompañan a los niños en su aprendizaje. Ideal para cualquier búsqueda relacionada con conservación ambiental." />
        <meta name="keywords" content=" Ratasura, Arcandina, Oficial, Cori, Jagui, Jagüi, Medio ambiente, Rio, Agua, Educación ambiental, Fundación Arcandina" />
        <meta name="author" content="Arcandina" />
        <meta property="og:title" content="Arcandina Oficial" />
        <meta property="og:description" content="Aprende con en el Arcandina cómo cuidar los recursos de nuestro planeta" />
        <meta property="og:url" content="https://arcandinaoficial.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://arcandinaoficial.org/apple-touch-icon.png" />
      </Head>
      <LoadingScreen />
    </>
  );
}
