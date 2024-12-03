import { getDictionary } from '@/dictionaries/dictionaries.js';
import Navbar from '@/components/Navbar';  
import BannerSection from '@/sections/BannerSection';
import AboutUsSection from '@/sections/AboutUsSection';
import RotarySection from '@/sections/RotarySection';
import ArkSection from '@/sections/ArkSection';
import FooterSection from '@/sections/FooterSection';
import NewsSection from '@/sections/NewsSection';

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
          <div className='boat-clip'>
            <AboutUsSection dict={dict}/>
          </div>
          <RotarySection dict={dict}/>
          <NewsSection dict={dict} lang={params.lang || 'es'}/>
          <ArkSection dict={dict}/>
        </main>
        <FooterSection dict={dict} params={params}/>
      </div>
    </>
  );
}