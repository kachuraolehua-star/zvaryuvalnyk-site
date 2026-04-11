"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { AppContext } from '@/components/GlobalWrapper';

// Ваша кастомна маска зварювальника!
const HardHat = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6V6z"/>
    <rect x="8" y="8" width="8" height="4" rx="1"/>
    <path d="M3 10h2"/>
    <path d="M19 10h2"/>
    <path d="M10 16h4"/>
  </svg>
);

// Міні-словник спеціально для сторінки помилок
const notFoundTexts = {
  uk: { 
    title: "Ой! Сторінку не знайдено", 
    desc: "Здається, ви перейшли за неправильним посиланням, або цю сторінку/статтю було видалено. Але не хвилюйтеся, у нас ще багато хороших вакансій!", 
    home: "На Головну", 
    vac: "Дивитись вакансії" 
  },
  pl: { 
    title: "Ups! Nie znaleziono strony", 
    desc: "Wygląda na to, że link jest nieprawidłowy lub strona/artykuł został usunięty. Ale nie martw się, mamy wiele świetnych ofert pracy!", 
    home: "Strona główna", 
    vac: "Zobacz oferty pracy" 
  },
  ru: { 
    title: "Ой! Страница не найдена", 
    desc: "Кажется, вы перешли по неверной ссылке, или эта страница/статья была удалена. Но не волнуйтесь, у нас еще много хороших вакансий!", 
    home: "На Главную", 
    vac: "Смотреть вакансии" 
  },
  en: { 
    title: "Oops! Page not found", 
    desc: "It looks like you clicked a broken link or the page/article was removed. But don't worry, we still have many great job offers!", 
    home: "Go Home", 
    vac: "View Vacancies" 
  }
};

export default function NotFoundPage() {
  const { l, lang } = useContext(AppContext);
  const text = notFoundTexts[lang] || notFoundTexts['uk'];

  return (
    <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 text-center max-w-2xl border border-gray-100 animate-[fadeInUp_0.3s_ease-out]">
        
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            404
          </div>
          {/* Тепер тут ваша маска! */}
          <HardHat size={48} className="text-yellow-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          {text.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {text.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={l('/')} className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/30 flex items-center justify-center hover:-translate-y-1">
            <Home size={20} className="mr-2" /> {text.home}
          </Link>
          <Link href={l('/vacancies')} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center hover:-translate-y-1">
            {text.vac} <ChevronRight size={20} className="ml-2" />
          </Link>
        </div>
        
      </div>
    </div>
  );
}