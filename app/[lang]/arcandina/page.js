import WorkingScreen from '@/arcandina/WorkingScreen';
import { getDictionary } from '@/dictionaries/dictionaries.js';

export default async function Home({ params }) {

  const dict = await getDictionary(params.lang);

  return (
    <section className='arcandina'>
      <WorkingScreen dict={dict} params={params}/>
    </section>
  );
}