import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// МАГИЯ ЗДЕСЬ: Отключаем кэширование, чтобы Sitemap всегда отдавал свежие данные из базы!
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = 'https://zvaryuvalnyk.xyz';
  
  const locales = ['pl', 'ru', 'en']; 
  const staticRoutes = ['', '/vacancies', '/training', '/blog'];
  
  let allPages = [];

  // 1. УКРАИНСКИЕ страницы (без префиксов)
  staticRoutes.forEach(route => {
    allPages.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
    });
  });

  // 2. ДРУГИЕ ЯЗЫКИ (с префиксами /pl, /ru, /en)
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      allPages.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: 0.8,
      });
    });
  });

  // 3. СТАТЬИ БЛОГА (Всегда актуальные!)
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));
      querySnapshot.forEach((doc) => {
        
        // Украинская версия статьи (без /uk)
        allPages.push({
          url: `${baseUrl}/blog/${doc.id}`,
          lastModified: new Date(doc.data().updatedAt || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
        
        // Иноязычные версии статьи
        locales.forEach((locale) => {
          allPages.push({
            url: `${baseUrl}/${locale}/blog/${doc.id}`,
            lastModified: new Date(doc.data().updatedAt || Date.now()),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        });
      });
    } catch (error) {
      console.error("Ошибка генерации Sitemap для блога:", error);
    }
  }

  return allPages;
}