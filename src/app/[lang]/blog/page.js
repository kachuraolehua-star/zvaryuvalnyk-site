// Server Component — без "use client"
// Firestore читается через REST API → надёжно в Node.js / Vercel

import { fetchCollection } from '@/lib/firestore-rest';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Eye } from 'lucide-react';

const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const parts = dateStr.split('.');
  if (parts.length !== 3) return 0;
  return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
};

const getPostText = (postObj, field, lang) => {
  if (!postObj || !postObj[field]) return '';
  if (typeof postObj[field] === 'string') return postObj[field];
  return postObj[field][lang] || postObj[field]['uk'] || '';
};

export default async function BlogIndexPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations['uk'];
  const l = (path) => lang === 'uk' ? path : `/${lang}${path}`;

  // Firestore REST API — без WebSocket, с ISR-кешем 5 минут
  const allPosts = await fetchCollection('blogPosts', { revalidate: 300 });
  allPosts.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-[fadeInUp_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.blog.title}</h1>
          <p className="text-xl text-gray-600">Всі статті та корисні матеріали</p>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 min-h-[50vh]">
            <p>Статті ще не додано.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allPosts.map((post, index) => (
              <Link href={l(`/blog/${post.id}`)} key={post.id} className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <Image
                    fill
                    src={post.image}
                    alt={getPostText(post, 'title', lang)}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-yellow-600 font-bold">{post.date}</p>
                      <p className="text-xs text-gray-400 font-bold flex items-center">
                        <Eye size={14} className="mr-1" /> {post.views || 0}
                      </p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-yellow-600 transition leading-snug">
                      {getPostText(post, 'title', lang) || 'Без заголовка'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {getPostText(post, 'excerpt', lang) || 'Опис відсутній...'}
                    </p>
                  </div>
                  <p className="text-sm text-yellow-600 flex items-center font-bold mt-auto pt-4 border-t border-gray-50">
                    {t.blog.read} <ChevronRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}