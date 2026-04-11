import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation'; // Секретное оружие Next.js для HTTP 404

// 1. Генерируем Метатеги (Title, Description)
export async function generateMetadata({ params }) {
  const { id, lang } = await params;
  if (!db) return { title: 'Блог | Zvaryuvalnyk.xyz' };

  try {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const seoTitle = data.seoTitle?.[lang] || data.seoTitle?.['uk'];
      const mainTitle = data.title?.[lang] || data.title?.['uk'];
      return {
        title: seoTitle || mainTitle || 'Стаття',
        description: data.excerpt?.[lang] || data.excerpt?.['uk'] || 'Стаття про роботу зварювальником у Польщі.',
      };
    }
  } catch (error) {
    console.error("SEO Fetch Error:", error);
  }
  return { title: 'Статтю не знайдено' };
}

// 2. Проверяем существование статьи
export default async function BlogArticleLayout({ children, params }) {
  const { id } = await params;
  
  if (db) {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    
    // Если статьи не существует в базе — принудительно обрываем загрузку и отдаем 404 статус!
    if (!docSnap.exists()) {
      notFound(); 
    }
  }

  return children;
}