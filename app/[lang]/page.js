import { getDictionary } from '@/dictionaries/dictionaries.js';
import Navbar from '@/components/Navbar';  
import BannerSection from '@/sections/BannerSection';
import AboutUsSection from '@/sections/AboutUsSection';
import RotarySection from '@/sections/RotarySection';
import ArkSection from '@/sections/ArkSection';
import FooterSection from '@/sections/FooterSection';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' },
  ];
}

export default async function Home({ params }) {

  const dict = await getDictionary(params.lang);

  return (
    <>
      <div>
        <Navbar dict={dict} params={params}/>
        <main className='landing-page__main'>
          <BannerSection dict={dict}/>
          <AboutUsSection dict={dict}/>
          <RotarySection dict={dict}/>
          <ArkSection dict={dict}/>
        </main>
        <FooterSection dict={dict}/>
      </div>
    </>
  );
}