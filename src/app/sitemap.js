import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = 'https://zvaryuvalnyk.xyz';

  // Все 4 локали. uk — без префикса в URL, остальные с /pl, /ru, /en
  const locales = ['uk', 'pl', 'ru', 'en'];
  const staticRoutes = ['', '/vacancies', '/training', '/blog'];

  // Хелпер: строит URL для конкретной локали и маршрута
  const buildUrl = (locale, route) =>
    locale === 'uk' ? `${baseUrl}${route}` : `${baseUrl}/${locale}${route}`;

  // Хелпер: строит объект alternates.languages для всех 4 локалей
  const buildAlternates = (route) => ({
    languages: Object.fromEntries(
      locales.map((locale) => [locale, buildUrl(locale, route)])
    ),
  });

  let allPages = [];

  // 1. Статические страницы — каждый язык отдельной записью + hreflang alternates
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      allPages.push({
        url: buildUrl(locale, route),
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: locale === 'uk' ? (route === '' ? 1 : 0.8) : 0.7,
        alternates: buildAlternates(route),
      });
    });
  });

  // 2. Динамические страницы блога — тоже со всеми языковыми вариантами
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));
      querySnapshot.forEach((docSnap) => {
        const slug = docSnap.id;
        const blogRoute = `/blog/${slug}`;
        const lastMod = new Date(docSnap.data().updatedAt || Date.now());

        locales.forEach((locale) => {
          allPages.push({
            url: buildUrl(locale, blogRoute),
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: locale === 'uk' ? 0.7 : 0.6,
            alternates: buildAlternates(blogRoute),
          });
        });
      });
    } catch (error) {
      console.error('Ошибка генерации Sitemap для блога:', error);
    }
  }

  return allPages;
}