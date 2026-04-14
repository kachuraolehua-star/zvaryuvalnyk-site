import "../globals.css";

/**
 * Корневой layout для /admin — независимый от публичного сайта.
 * Без GTM: действия администратора не должны попадать в аналитику.
 */
export default function AdminLayout({ children }) {
  return (
    <html lang="uk" style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}