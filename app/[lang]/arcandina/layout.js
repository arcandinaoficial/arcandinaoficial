import { getDictionary } from '@/dictionaries/dictionaries.js';

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.lang);
  return {
    title: dict.arcandinaTitle,
    description: dict.arcandinaDescription,
  };
}

export default async function ArcandinaLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
