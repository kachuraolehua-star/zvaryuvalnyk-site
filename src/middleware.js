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

  // 301 редирект: устраняем дублирование контента для дефолтной локали.
  // /uk        → /          (постоянный редирект)
  // /uk/blog   → /blog      (постоянный редирект)
  // /uk/blog/x → /blog/x   (постоянный редирект)
  if (pathname === '/uk') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  if (pathname.startsWith('/uk/')) {
    // slice(3) убирает ровно три символа '/uk', оставляя '/...'
    return NextResponse.redirect(new URL(pathname.slice(3), request.url), 301);
  }

  const locales = ['uk', 'pl', 'ru', 'en'];

  // Перевіряємо, чи вже є мова в URL (наприклад /pl/vacancies)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Якщо це інша мова (/pl, /ru, /en) — нічого не робимо, залишаємо як є
  if (pathnameHasLocale) return;

  // REWRITE (не redirect!): браузер показує /vacancies,
  // Next.js завантажує /uk/vacancies — без зміни URL в адресному рядку.
  return NextResponse.rewrite(new URL(`/uk${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
