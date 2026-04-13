import "./globals.css";

export default function RootLayout({ children }) {
  // Дочерние layouts ([lang]/layout.js, admin/layout.js) переопределяют
  // этот html/body своими тегами — suppresHydrationWarning убирает предупреждение.
  return children;
}