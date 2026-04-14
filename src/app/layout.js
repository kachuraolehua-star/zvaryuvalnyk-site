// Корневой layout без html/body — паттерн Multiple Root Layouts.
// Каждый роут-сегмент ([lang]/layout.js, admin/layout.js) рендерит
// свой собственный <html> с правильным lang-атрибутом.
// Это устраняет "матрёшку" с вложенными тегами <html>.

// metadataBase: единая точка для разрешения OpenGraph-изображений
// и относительных canonical во всех дочерних generateMetadata.
export const metadata = {
  metadataBase: new URL('https://zvaryuvalnyk.xyz'),
};

export default function RootLayout({ children }) {
  return children;
}