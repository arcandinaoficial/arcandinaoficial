import { NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['es', 'en']; // Supported locales
const defaultLocale = 'en';

function getLocale(request) {
  const negotiator = new Negotiator({ headers: { 'accept-language': request.headers.get('accept-language') } });
  const languages = negotiator.languages();
  return match(languages, locales, defaultLocale);
}

function isValidLocale(locale) {
  try {
    return Intl.getCanonicalLocales(locale).length > 0;
  } catch (e) {
    return false; // Invalid locale
  }
}

export function middleware(request) {
  console.log('Running middleware...');
  const { pathname } = request.nextUrl;
  const lang = pathname.split('/')[1]; // Extract the language part from the path

  // Handle root path ("/")
  if (pathname === '/') {
    const locale = getLocale(request); // Detect preferred language
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Check if the exact language is valid but unsupported (redirect to "/en")
  if (!locales.includes(lang)) {
    // Check if it's an exact match for a valid locale
    if (lang.length === 2 && isValidLocale(lang)) {
      return NextResponse.redirect(new URL(`/en${pathname.slice(lang.length + 1)}`, request.url));
    }

     return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:lang*'],
};
