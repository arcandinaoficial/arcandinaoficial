import { getDictionary } from '@/dictionaries/dictionaries.js';

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.lang);
  return {
    title: dict.landingPageTitle,
    description: dict.landingPageDescription,
  };
}

export default async function RootLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
