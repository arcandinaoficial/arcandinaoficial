import { getDictionary } from '@/dictionaries/dictionaries.js';
import { Button } from 'primereact/button';
import Navbar from '@/components/Navbar';  

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
    <div>
      <nav>
        <Navbar />
      </nav>
      <main>
        <h1>{dict.title}</h1>
        <Button label="Submit"/>
      </main>
      <footer className='footer'>
        <p>{dict.description}</p>
      </footer>
    </div>
  );
}
