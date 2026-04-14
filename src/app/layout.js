import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google';

// metadataBase — базовый URL для разрешения относительных canonical и og:image
export const metadata = {
  metadataBase: new URL('https://zvaryuvalnyk.xyz'),
};

export default function RootLayout({ children }) {
  // Дочерние layouts ([lang]/layout.js, admin/layout.js) переопределяют
  // этот html/body своими тегами — suppressHydrationWarning убирает предупреждение.
  return (
    <html lang="uk" suppressHydrationWarning>
      {/* GTM: инжектирует <script> в <head> и <noscript> в <body> автоматически */}
      <GoogleTagManager gtmId="GTM-WZLGT64Q" />
      <body>{children}</body>
    </html>
  );
}