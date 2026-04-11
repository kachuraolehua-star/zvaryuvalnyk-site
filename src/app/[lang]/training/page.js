"use client";

import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { AppContext } from '@/components/GlobalWrapper';
import { ChevronRight, CheckCircle2, MapPin } from 'lucide-react';

export default function TrainingPage() {
  const { t, setShowModal, l } = useContext(AppContext);

  // Скидаємо скрол наверх при завантаженні сторінки
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-[fadeInUp_0.3s_ease-out]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Кнопка "Назад" */}
        <Link href={l('/')} className="inline-flex items-center text-gray-500 hover:text-slate-900 mb-6 font-medium transition">
          <ChevronRight size={20} className="rotate-180 mr-1" /> {t.trainingTab.back}
        </Link>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          
          {/* Темний заголовок з картинкою на фоні */}
          <div className="h-80 bg-slate-900 relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Навчання зварюванню" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
            />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="animate-[fadeInUp_0.6s_ease-out]">
                <span className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg inline-block mb-6">
                  {t.trainingTab.badge}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
                  {t.trainingTab.title}
                </h1>
                
                <button 
                  onClick={() => setShowModal(true)} 
                  className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-yellow-400 transition shadow-xl shadow-yellow-500/30 hover:-translate-y-1"
                >
                  {t.trainingTab.signUpBtn || "Записатись на курс"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Контент сторінки */}
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-700">
              
              <p className="lead text-xl font-medium text-slate-900 mb-10 border-l-4 border-yellow-500 pl-6 bg-slate-50 py-4 rounded-r-xl">
                {t.trainingTab.lead}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Що ви отримаєте */}
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2"/> {t.trainingTab.getTitle}
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.trainingTab.get1}</li>
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.trainingTab.get2}</li>
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.trainingTab.get3}</li>
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.trainingTab.get4}</li>
                  </ul>
                </div>
                
                {/* Умови */}
                <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200 shadow-sm">
                  <h3 className="text-xl font-bold text-yellow-900 mb-6 flex items-center">
                    <MapPin className="text-yellow-600 mr-2"/> {t.trainingTab.reqTitle}
                  </h3>
                  <ul className="space-y-4 text-yellow-900/90">
                    <li><strong className="text-yellow-900 block mb-1">{t.trainingTab.reqLocL}</strong> {t.trainingTab.reqLocV}</li>
                    <li><strong className="text-yellow-900 block mb-1">{t.trainingTab.reqWhoL}</strong> {t.trainingTab.reqWhoV}</li>
                    <li><strong className="text-yellow-900 block mb-1">{t.trainingTab.reqStartL}</strong> {t.trainingTab.reqStartV}</li>
                  </ul>
                </div>
              </div>

              {/* Чому це стабільність */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">{t.trainingTab.whyTitle}</h3>
              <p className="mb-6 leading-relaxed">{t.trainingTab.whyText}</p>

              {/* Заклик до дії (CTA) нижній */}
              <div className="mt-12 bg-slate-900 text-white p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">{t.trainingTab.ctaTitle}</h3>
                  <p className="text-gray-300 mb-8 text-lg">{t.trainingTab.ctaDesc}</p>
                  <button 
                    onClick={() => setShowModal(true)} 
                    className="text-black px-12 py-5 rounded-xl font-extrabold text-xl hover:brightness-110 transition w-full md:w-auto shadow-xl shadow-yellow-500/30 hover:-translate-y-1" 
                    style={{ backgroundColor: 'rgb(234, 179, 8)' }}
                  >
                    {t.trainingTab.ctaBtn}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}