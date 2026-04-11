export default function robots() {
  return {
    rules: {
      userAgent: '*', // Разрешаем всем ботам (Google, Bing и т.д.)
      allow: '/',     // Разрешаем сканировать весь сайт
      disallow: '/admin/', // ЗАПРЕЩАЕМ ботам индексировать админку!
    },
    sitemap: 'https://zvaryuvalnyk.xyz/sitemap.xml', // Указываем, где лежит карта сайта
  }
}