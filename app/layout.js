import '@/styles/global.scss';

// PrimeReact styling
import 'primereact/resources/themes/saga-orange/theme.css';   
import 'primeflex/primeflex.css';                                  
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/primereact.min.css';

export default function RootLayout({ children, params }) {
  const baseUrl = "https://arcandinaoficial.org";

  return (
    <html suppressHydrationWarning lang={params.lang}>
      <head>
        {/* Favicon compatibility */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* SEO: Language versions */}
        <link rel="alternate" hreflang="es" href={`${baseUrl}/es`} />
        <link rel="alternate" hreflang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hreflang="x-default" href={baseUrl} />

        {/* SEO: Canonical version */}
        <link rel="canonical" href={`${baseUrl}/es`} />

        {/* Optional: block indexing of the root if you want */}
        {/* Only use this on "/" if you're redirecting immediately via JS */}
        {/* <meta name="robots" content="noindex, follow" /> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
