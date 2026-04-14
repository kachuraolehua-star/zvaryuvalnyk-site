"use client";

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppContext } from '@/components/GlobalWrapper';
import { ChevronRight, Eye } from 'lucide-react';
import Image from 'next/image';

// МАГІЯ: ФУНКЦІЯ ПЕРЕТВОРЕННЯ ДАТИ (ДД.ММ.РРРР -> ЧАС ДЛЯ СОРТУВАННЯ)
const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const parts = dateStr.split('.');
  if (parts.length !== 3) return 0;
  return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
};

export default function BlogIndexPage() {
  const { lang, t, l } = useContext(AppContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPostText = (postObj, field) => {
    if (!postObj || !postObj[field]) return "";
    if (typeof postObj[field] === 'string') return postObj[field];
    return postObj[field][lang] || postObj[field]['uk'] || '';
  };

  useEffect(() => {
    if (!db) return;
    const postsRef = collection(db, 'blogPosts');
    getDocs(postsRef)
      .then((snapshot) => {
        const loadedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        loadedPosts.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        setBlogPosts(loadedPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Firestore error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-[fadeInUp_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.blog.title}</h1>
          <p className="text-xl text-gray-600">Всі статті та корисні матеріали</p>
        </div>

        {loading ? (
          <div className="py-20 text-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 min-h-[50vh]">
            <p>Статті ще не додано.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link href={l(`/blog/${post.id}`)} key={post.id} className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                   <Image
                   fill
                   src={post.image}
                   alt={getPostText(post, 'title')}
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
                      {getPostText(post, 'title') || 'Без заголовка'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {getPostText(post, 'excerpt') || 'Опис відсутній...'}
                    </p>
                  </div>
                  <p className="text-sm text-yellow-600 flex items-center font-bold mt-auto pt-4 border-t border-gray-50">{t.blog.read} <ChevronRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform" /></p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}