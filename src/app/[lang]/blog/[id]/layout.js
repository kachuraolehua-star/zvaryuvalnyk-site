import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';

const baseUrl = 'https://zvaryuvalnyk.xyz';

// 1. Генерируем метатеги (Title, Description, Canonical, hreflang)
export async function generateMetadata({ params }) {
  const { id, lang } = await params;

  // Хелпер для построения alternates одной статьи
  const buildArticleAlternates = (slug, currentLang) => {
    const blogRoute = `/blog/${slug}`;
    return {
      canonical: currentLang === 'uk'
        ? `${baseUrl}${blogRoute}`
        : `${baseUrl}/${currentLang}${blogRoute}`,
      languages: {
        'uk': `${baseUrl}${blogRoute}`,
        'pl': `${baseUrl}/pl${blogRoute}`,
        'ru': `${baseUrl}/ru${blogRoute}`,
        'en': `${baseUrl}/en${blogRoute}`,
      },
    };
  };

  if (!db) {
    return {
      title: 'Блог | Zvaryuvalnyk.xyz',
      alternates: buildArticleAlternates(id, lang),
    };
  }

  try {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const seoTitle  = data.seoTitle?.[lang]  || data.seoTitle?.['uk'];
      const mainTitle = data.title?.[lang]      || data.title?.['uk'];
      return {
        title:       seoTitle || mainTitle || 'Стаття',
        description: data.excerpt?.[lang] || data.excerpt?.['uk'] || 'Стаття про роботу зварювальником у Польщі.',
        alternates:  buildArticleAlternates(id, lang),
      };
    }
  } catch (error) {
    console.error('SEO Fetch Error:', error);
  }

  return {
    title:      'Статтю не знайдено',
    alternates: buildArticleAlternates(id, lang),
  };
}

// 2. Проверяем существование статьи — если нет, отдаём HTTP 404
export default async function BlogArticleLayout({ children, params }) {
  const { id } = await params;

  if (db) {
    const docRef  = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      notFound();
    }
  }

  return children;
}