import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap() {
  const baseUrl = 'https://zvaryuvalnyk.xyz';
  
  // Прибрали 'uk' з масиву локалей!
  const locales = ['pl', 'ru', 'en']; 
  const staticRoutes = ['', '/vacancies', '/training', '/blog'];
  
  let allPages = [];

  // 1. УКРАЇНСЬКІ сторінки (без префіксів)
  staticRoutes.forEach(route => {
    allPages.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
    });
  });

  // 2. ДРУГІ МОВИ (з префіксами /pl, /ru, /en)
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

  // 3. СТАТТІ БЛОГУ
  try {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    querySnapshot.forEach((doc) => {
      
      // Українська версія статті (без /uk)
      allPages.push({
        url: `${baseUrl}/blog/${doc.id}`,
        lastModified: new Date(doc.data().updatedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      
      // Іншомовні версії статті
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
    console.error("Помилка генерації Sitemap для блогу:", error);
  }

  return allPages;
}