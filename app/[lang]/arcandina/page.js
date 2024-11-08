import WorkingScreen from '@/arcandina/WorkingScreen';
import { getDictionary } from '@/dictionaries/dictionaries.js';

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
    <section className='arcandina'>
      <WorkingScreen dict={dict} params={params}/>
    </section>
  );
}