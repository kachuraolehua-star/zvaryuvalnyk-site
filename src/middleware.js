import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Пропускаємо системні файли та адмінку
  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin')
  ) {
    return;
  }

  const locales = ['uk', 'pl', 'ru', 'en'];
  
  // Перевіряємо, чи вже є мова в URL (наприклад /pl/vacancies)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Якщо це інша мова — нічого не робимо, залишаємо як є
  if (pathnameHasLocale) return;

  // МАГІЯ ТУТ: Робимо rewrite (підміну), а не redirect!
  // Браузер показуватиме /vacancies, але Next.js завантажить /uk/vacancies
  return NextResponse.rewrite(new URL(`/uk${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
