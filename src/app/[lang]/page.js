"use client";

import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppContext } from '@/components/GlobalWrapper';
import { MapPin, Banknote, CheckCircle2, ChevronRight, ShieldCheck, GraduationCap, Eye } from 'lucide-react';
import Image from 'next/image';

const RevealOnScroll = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(ref.current);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
      {children}
    </div>
  );
};

// МАГІЯ: ФУНКЦІЯ ПЕРЕТВОРЕННЯ ДАТИ (ДД.ММ.РРРР -> ЧАС ДЛЯ СОРТУВАННЯ)
const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const parts = dateStr.split('.');
  if (parts.length !== 3) return 0;
  return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
};

export default function HomePage() {
  const { lang, t, setShowModal, l } = useContext(AppContext);
  const [blogPosts, setBlogPosts] = useState([]);

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
        setBlogPosts(loadedPosts.slice(0, 3));
      })
      .catch((error) => console.error('Firestore error:', error));
  }, []);

  return (
    <div className="animate-[fadeInUp_0.3s_ease-out]">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            fill
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Зварювальник"
            className="object-cover opacity-20 scale-105 animate-[pulse_15s_ease-in-out_infinite]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
          <div className="max-w-2xl animate-[fadeInUp_0.8s_ease-out]">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold tracking-wider mb-4 border border-yellow-500/30">
              {t.hero.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {t.hero.title1}<span className="text-yellow-500">{t.hero.titleHighlight}</span>{t.hero.title2}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              {t.hero.desc1}<strong className="text-white">{t.hero.descHighlight}</strong>{t.hero.desc2}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowModal(true)} className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/30 flex items-center justify-center hover:-translate-y-1">
                {t.hero.apply} <ChevronRight size={20} className="ml-2" />
              </button>
              <Link href={l('/training')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center backdrop-blur-sm hover:-translate-y-1">
                {t.hero.courses}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <RevealOnScroll>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">{t.benefits.title}</h2>
              <p className="mt-4 text-lg text-gray-600">{t.benefits.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: t.benefits.b1t, desc: t.benefits.b1d },
                { icon: Banknote, title: t.benefits.b2t, desc: t.benefits.b2d },
                { icon: MapPin, title: t.benefits.b3t, desc: t.benefits.b3d },
                { icon: CheckCircle2, title: t.benefits.b4t, desc: t.benefits.b4d }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition duration-300">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 text-yellow-600">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Vacancies Preview */}
      <RevealOnScroll>
        <section className="py-16 bg-slate-50" id="vacancies">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.vacancies.title}</h2>
                <p className="text-gray-600">{t.vacancies.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Link href={l('/vacancies')} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl transition-all flex flex-col md:flex-row group">
                <div className="md:w-2/5 relative overflow-hidden h-48 md:h-full">
                  <Image
                    fill
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
                    alt="Зварювальник MIG/MAG"
                    className="object-cover bg-gray-200 transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black font-extrabold px-3 py-1 rounded shadow">HOT</div>
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">{t.vacancies.v1t}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                      <span className="flex items-center"><MapPin size={16} className="mr-1" /> {t.vacancies.v1loc}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" /> {t.vacancies.v1b1}</li>
                      <li className="flex items-start text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" /> {t.vacancies.v1b2}</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t.vacancies.rate}</p>
                      <p className="text-2xl font-extrabold text-slate-900">38 zł <span className="text-base font-normal text-gray-500">{t.vacancies.net}</span></p>
                    </div>
                    <button className="bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold shadow-md group-hover:bg-yellow-400 transition">{t.vacancies.details}</button>
                  </div>
                </div>
              </Link>

              <Link href={l('/vacancies')} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl transition-all flex flex-col md:flex-row group">
                <div className="md:w-2/5 relative overflow-hidden h-48 md:h-full">
                  <Image
                    fill
                    src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Слюсар"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">{t.vacancies.v2t}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                      <span className="flex items-center"><MapPin size={16} className="mr-1" /> {t.vacancies.v2loc}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" /> {t.vacancies.v2b1}</li>
                      <li className="flex items-start text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" /> {t.vacancies.v2b2}</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t.vacancies.rate}</p>
                      <p className="text-xl font-bold text-slate-900">{t.vacancies.from}28 zł <span className="text-sm font-normal text-gray-500">{t.vacancies.net}</span></p>
                    </div>
                    <button className="bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold shadow-md group-hover:bg-yellow-400 transition">{t.vacancies.details}</button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Training Promo */}
      <RevealOnScroll>
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={l('/training')} className="block bg-gradient-to-r from-red-700 to-red-900 rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center">
                <div className="p-10 md:p-12 md:w-2/3">
                  <div className="inline-block px-4 py-1.5 bg-yellow-500 text-black font-extrabold text-sm rounded-full mb-6 shadow-md">
                    {t.trainingPromo.badge}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight group-hover:text-yellow-200 transition-colors">
                    {t.trainingPromo.title1}<br/>{t.trainingPromo.title2}
                  </h2>
                  <p className="text-red-100 text-lg mb-6 max-w-xl">
                    {t.trainingPromo.desc}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button className="w-full sm:w-auto bg-white text-red-800 font-bold px-8 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center group-hover:bg-gray-100 group-hover:-translate-y-1">
                      {t.trainingPromo.btn} <GraduationCap className="ml-2" size={20}/>
                    </button>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/3 p-6 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Навчання зварювальників"
                    width={600}
                    height={700}
                    className="rounded-2xl border-4 border-white/20 shadow-2xl transform rotate-3 object-cover scale-125 -ml-8 origin-center z-20 relative transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110"
                  />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      {/* Blog Preview */}
      <RevealOnScroll>
        <section className="py-16 bg-slate-50" id="blog">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">{t.blog.title}</h2>
              <p className="mt-4 text-gray-600">{t.blog.desc}</p>
            </div>
            
            {blogPosts.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p>Статті ще не додано. Перейдіть в Адмін-панель.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Link href={l(`/blog/${post.id}`)} key={post.id} className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                       <Image
                       fill
                       src={post.image}
                       alt={getPostText(post, 'title')}
                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                       sizes="(max-width: 768px) 100vw, 33vw"
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

            {blogPosts.length > 0 && (
              <div className="mt-12 text-center">
                <Link href={l('/blog')} className="inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg hover:-translate-y-1">
                  Всі статті <ChevronRight size={20} className="ml-2" />
                </Link>
              </div>
            )}

           </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}