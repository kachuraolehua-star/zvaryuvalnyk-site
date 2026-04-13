"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppContext } from '@/components/GlobalWrapper';
import { ChevronRight, Eye } from 'lucide-react';
import Image from 'next/image';

export default function BlogPost() {
  const { id } = useParams(); 
  const { lang, t, l } = useContext(AppContext);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPostText = (postObj, field) => {
    if (!postObj || !postObj[field]) return "";
    if (typeof postObj[field] === 'string') return postObj[field];
    return postObj[field][lang] || postObj[field]['uk'] || '';
  };

  // МАГИЯ: Функция для жирного текста
  const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-slate-900 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  useEffect(() => {
    if (!id || !db) return;
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
          
          // Добавляем +1 к просмотрам при открытии статьи
          await updateDoc(docRef, { views: increment(1) });
        }
      } catch (error) {
        console.error("Помилка завантаження статті:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0); 
  }, [id]);

  if (loading || !post) {
    return (
      <div className="py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-[fadeInUp_0.3s_ease-out]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href={l('/blog')} className="inline-flex items-center text-gray-500 hover:text-slate-900 mb-8 font-medium transition">
          <ChevronRight size={20} className="rotate-180 mr-1" /> {t.blogDetail.back}
        </Link>
        
        <article className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="h-64 md:h-96 w-full relative">
            <Image
              fill
              src={post.image || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"}
              alt={getPostText(post, 'title')}
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
                 {/* СЧЕТЧИК ПРОСМОТРОВ */}
                 <span className="flex items-center text-gray-400">
                   <Eye size={16} className="mr-1.5" /> {post.views ? post.views + 1 : 1}
                 </span>
              </div>
              {/* УМЕНЬШЕННЫЙ ЗАГОЛОВОК H1 */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                {getPostText(post, 'title') || 'Без заголовка'}
              </h1>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="lead text-xl font-medium text-slate-900 mb-8 p-6 bg-slate-50 rounded-2xl border-l-4 border-yellow-500">
                {getPostText(post, 'excerpt') || 'Опис відсутній.'}
              </p>
              
              {/* ВЫВОД ТЕКСТА С ПОДДЕРЖКОЙ ЖИРНОГО */}
              {getPostText(post, 'content').split('\n').map((paragraph, idx) => (
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
  );
}