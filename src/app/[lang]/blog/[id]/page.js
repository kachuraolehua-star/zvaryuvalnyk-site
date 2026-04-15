// Server Component — без "use client", без useState/useEffect
// Googlebot получает готовый HTML со всем текстом статьи

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Eye } from 'lucide-react';
import { notFound } from 'next/navigation';

const getPostText = (postObj, field, lang) => {
  if (!postObj || !postObj[field]) return '';
  if (typeof postObj[field] === 'string') return postObj[field];
  return postObj[field][lang] || postObj[field]['uk'] || '';
};

const renderFormattedText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-slate-900 font-extrabold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export default async function BlogPost({ params }) {
  const { lang, id } = await params;
  const t       = translations[lang] || translations['uk'];
  const l       = (path) => lang === 'uk' ? path : `/${lang}${path}`;
  const baseUrl = 'https://zvaryuvalnyk.xyz';

  if (!db) notFound();

  let post;
  try {
    const docRef  = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) notFound();
    post = { id: docSnap.id, ...docSnap.data() };
    // Счётчик просмотров (инкремент на сервере)
    await updateDoc(docRef, { views: increment(1) });
  } catch (error) {
    console.error('Blog post fetch error:', error);
    notFound();
  }

  const title   = getPostText(post, 'title', lang);
  const excerpt = getPostText(post, 'excerpt', lang);
  const content = getPostText(post, 'content', lang);
  const postUrl = lang === 'uk'
    ? `${baseUrl}/blog/${id}`
    : `${baseUrl}/${lang}/blog/${id}`;

  // ── JSON-LD: Article ─────────────────────────────────────────────
  const articleSchema = {
    '@context':  'https://schema.org',
    '@type':     'Article',
    '@id':       postUrl,
    headline:    title,
    description: excerpt,
    image:       post.image || `${baseUrl}/og-image.jpg`,
    datePublished: post.date,
    author:    { '@type': 'Organization', name: 'ZVARYUVALNYK', url: baseUrl },
    publisher: {
      '@type': 'Organization',
      name:    'ZVARYUVALNYK',
      logo:    { '@type': 'ImageObject', url: `${baseUrl}/og-image.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage: lang,
  };

  // ── JSON-LD: BreadcrumbList ───────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.nav.home,
        item: lang === 'uk' ? baseUrl : `${baseUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: t.nav.blog,
        item: lang === 'uk' ? `${baseUrl}/blog` : `${baseUrl}/${lang}/blog` },
      { '@type': 'ListItem', position: 3, name: title, item: postUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="py-12 bg-slate-50 min-h-screen animate-[fadeInUp_0.3s_ease-out]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link href={l('/blog')} className="inline-flex items-center text-gray-500 hover:text-slate-900 mb-8 font-medium transition">
            <ChevronRight size={20} className="rotate-180 mr-1" /> {t.blogDetail.back}
          </Link>

          <article className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="h-64 md:h-96 w-full relative">
              <Image
                fill
                src={post.image || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80'}
                alt={title}
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            <div className="p-8 md:p-12 -mt-20 relative z-10 bg-white rounded-t-3xl">
              <div className="mb-8 border-b border-gray-100 pb-8">
                <div className="flex items-center text-sm font-bold text-yellow-600 mb-4 space-x-4">
                  <span>Опубліковано: {post.date}</span>
                  <span className="flex items-center text-gray-400">
                    <Eye size={16} className="mr-1.5" /> {(post.views || 0) + 1}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  {title || 'Без заголовка'}
                </h1>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="lead text-xl font-medium text-slate-900 mb-8 p-6 bg-slate-50 rounded-2xl border-l-4 border-yellow-500">
                  {excerpt || 'Опис відсутній.'}
                </p>
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6 leading-relaxed text-lg">
                    {renderFormattedText(paragraph)}
                  </p>
                ))}
              </div>

              <div className="mt-12 p-8 bg-yellow-50 rounded-2xl border border-yellow-200 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{t.footer.ctaTitle || 'Шукаєте роботу?'}</h4>
                  <p className="text-gray-600">{t.footer.ctaDesc || 'Залиште контакти.'}</p>
                </div>
                <Link href={l('/vacancies')} className="mt-4 sm:mt-0 w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg text-center hover:-translate-y-1 block">
                  {t.vacancies.details || 'Дивитись вакансії'}
                </Link>
              </div>
            </div>
          </article>

        </div>
      </div>
    </>
  );
}