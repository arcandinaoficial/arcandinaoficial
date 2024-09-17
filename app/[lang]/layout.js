import "./globals.css";
import { getDictionary } from '@/app/[lang]/dictionaries/dictionaries.js';

export async function generateMetadata({ params }) {

  const dict = await getDictionary(params.lang);

  return {
    title: dict.landingPageTitle,
    description: dict.landingPageDescription,
  };
}

export default function RootLayout({ children, params }) {
  return (
    <html suppressHydrationWarning lang={params.lang}>
      <body>
        {children}
      </body>
    </html>
  );
}
