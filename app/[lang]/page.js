import styles from "./page.module.css";
import { getDictionary } from '@/app/[lang]/dictionaries/dictionaries.js';

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
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{dict.title}</h1>
      </main>
      <footer className={styles.footer}>
        <p>{dict.description}</p>
      </footer>
    </div>
  );
}
