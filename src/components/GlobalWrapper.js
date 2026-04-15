"use client";

import React, { useState, createContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translations } from '@/lib/translations';
import { Menu, X, Phone, Globe } from 'lucide-react';

export const AppContext = createContext();

const HardHat = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6V6z"/>
    <rect x="8" y="8" width="8" height="4" rx="1"/>
    <path d="M3 10h2"/>
    <path d="M19 10h2"/>
    <path d="M10 16h4"/>
  </svg>
);

// Вынесен за пределы GlobalWrapper — не пересоздаётся при каждом рендере родителя
function LeadModal({ showModal, setShowModal, t, isSubmitting, handleFormSubmit }) {
  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-[fadeInUp_0.3s_ease-out]">
        <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-500 hover:text-black transition"><X size={24} /></button>
        <h3 className="text-2xl font-bold mb-2">{t.modal.title}</h3>
        <p className="text-gray-600 mb-6">{t.modal.desc}</p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input type="hidden" name="_subject" value="Нова заявка з сайту Zvaryuvalnyk.xyz!" />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.name}</label><input name="Ім'я" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.phone}</label><input name="Телефон" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" required /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.interest}</label>
            <select name="Цікавить" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none">
              <option>{t.modal.opt1}</option><option>{t.modal.opt2}</option><option>{t.modal.opt3}</option><option>{t.modal.opt4}</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 disabled:opacity-50">{isSubmitting ? "Відправка..." : t.modal.send}</button>
          <p className="text-xs text-center text-gray-500 mt-4">{t.modal.terms}</p>
        </form>
      </div>
    </div>
  );
}

export default function GlobalWrapper({ children }) {
  const pathname = usePathname(); 
  const segments = pathname.split('/');
  const currentLang = segments[1];
  const locales = ['uk', 'pl', 'ru', 'en'];
  const lang = locales.includes(currentLang) ? currentLang : 'uk';

  // НАШ НОВИЙ ПОМІЧНИК ДЛЯ ПОСИЛАНЬ
  const l = (path) => {
    if (lang === 'uk') return path;
    return path === '/' ? `/${lang}` : `/${lang}${path}`;
  };

  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[lang];

  // МАГИЯ ДЛЯ БРАУЗЕРА: Меняем язык HTML-документа налету!
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Розумне перемикання мов
  const handleLangChange = (e) => {
    const newLang = e.target.value;
    let newPath = pathname;

    if (lang !== 'uk') {
      newPath = pathname.replace(`/${lang}`, '') || '/';
    }
    if (newLang !== 'uk') {
      newPath = newPath === '/' ? `/${newLang}` : `/${newLang}${newPath}`;
    }
    window.location.href = newPath;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    try {
      const ipRes = await fetch("https://ipapi.co/json/");
      if (ipRes.ok) {
         const ipData = await ipRes.json();
         formData.append("IP Адреса", ipData.ip || "Невідомо");
         formData.append("Місто", ipData.city || "Невідомо");
         // ДОДАНА КРАЇНА
         formData.append("Країна", ipData.country_name || "Невідомо");
      }
    } catch (err) {}
    try {
      const res = await fetch("https://formsubmit.co/ajax/kachuraolehua@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      if(res.ok) {
         alert(t.modal.success);
         setShowModal(false);
      } else {
         alert("Підтвердіть пошту FormSubmit у вашій скринці!");
      }
    } catch (error) {
      alert("Виникла помилка відправки.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // ПЕРЕДАЄМО ФУНКЦІЮ l У ВСІ СТОРІНКИ САЙТУ
  return (
    <AppContext.Provider value={{ lang, showModal, setShowModal, t, l }}>
      <style dangerouslySetInnerHTML={{__html: `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes pulse { 0%, 100% { transform: scale(1.05); } 50% { transform: scale(1.1); } }`}} />
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
        <LeadModal
        showModal={showModal}
        setShowModal={setShowModal}
        t={t}
        isSubmitting={isSubmitting}
        handleFormSubmit={handleFormSubmit}
      />

        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href={l('/')} className="flex-shrink-0 flex items-center group">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:bg-yellow-400 transition-colors"><HardHat className="text-black" size={24} /></div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 uppercase">ZVARYUVALNYK</span>
              </Link>

              <nav className="hidden md:flex space-x-8">
                <Link href={l('/')} className={`text-sm font-semibold transition ${pathname === l('/') ? 'text-yellow-700' : 'text-gray-600 hover:text-yellow-700'}`}>{t.nav.home}</Link>
                <Link href={l('/vacancies')} className={`text-sm font-semibold transition ${pathname.includes('/vacancies') ? 'text-yellow-700' : 'text-gray-600 hover:text-yellow-700'}`}>{t.nav.vacancies}</Link>
                <Link href={l('/training')} className={`text-sm font-semibold transition ${pathname.includes('/training') ? 'text-yellow-700' : 'text-gray-600 hover:text-yellow-700'}`}>{t.nav.training}</Link>
                <Link href={l('/blog')} className={`text-sm font-semibold transition ${pathname.includes('/blog') ? 'text-yellow-700' : 'text-gray-600 hover:text-yellow-700'}`}>{t.nav.blog}</Link>
              </nav>

              <div className="flex items-center">
                <div className="hidden sm:flex items-center space-x-1 mr-4 bg-gray-100 rounded-lg py-1 px-2 border border-gray-200">
                  <Globe size={16} className="text-gray-500" />
                  <select value={lang} onChange={handleLangChange} className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer appearance-none pl-1 pr-2">
                    <option value="uk">UA</option><option value="pl">PL</option><option value="ru">RU</option><option value="en">EN</option>
                  </select>
                </div>
                <button onClick={() => setShowModal(true)} className="hidden lg:flex items-center justify-center bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-500 transition shadow-lg hover:-translate-y-0.5"><Phone size={18} className="mr-2" />{t.header.callMe}</button>
                <button className="md:hidden p-2 text-gray-600 ml-2 bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-xl absolute w-full z-50">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center"><Globe size={16} className="mr-2"/> Language:</span>
                <select value={lang} onChange={handleLangChange} className="bg-transparent text-sm font-bold text-slate-900 border border-gray-300 rounded px-2 py-1">
                  <option value="uk">Українська</option><option value="pl">Polski</option><option value="ru">Русский</option><option value="en">English</option>
                </select>
              </div>
              <Link href={l('/')} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-50">{t.nav.home}</Link>
              <Link href={l('/vacancies')} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-50">{t.nav.vacancies}</Link>
              <Link href={l('/training')} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-50">{t.nav.training}</Link>
              <Link href={l('/blog')} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-50">{t.nav.blog}</Link>
              <button onClick={() => { setShowModal(true); setIsMenuOpen(false); }} className="mt-4 w-full bg-green-600 text-white px-3 py-3 rounded-md font-bold">{t.header.callMe}</button>
            </div>
          )}
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              <div className="md:col-span-4 lg:col-span-5">
                <div className="flex items-center mb-6">
                  <HardHat className="text-yellow-500 mr-2" size={28} />
                  <span className="font-extrabold text-2xl tracking-tight text-white uppercase">ZVARYUVALNYK</span>
                </div>
                <p className="text-gray-400 leading-relaxed pr-4">{t.footer.desc}</p>
              </div>
              <div className="md:col-span-3 lg:col-span-2">
                <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">{t.footer.links}</h4>
                <ul className="space-y-4">
                  <li><Link href={l('/vacancies')} className="hover:text-yellow-500 transition">{t.nav.vacancies}</Link></li>
                  <li><Link href={l('/training')} className="hover:text-yellow-500 transition">{t.nav.training}</Link></li>
                  <li><Link href={l('/blog')} className="hover:text-yellow-500 transition">{t.nav.blog}</Link></li>
                </ul>
              </div>
              <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-center">
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-3 text-xl">{t.footer.ctaTitle || 'Шукаєте роботу?'}</h4>
                    <p className="text-sm mb-6 text-gray-400 leading-relaxed">{t.footer.ctaDesc}</p>
                  </div>
                  <button onClick={() => setShowModal(true)} className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg text-lg">{t.header.leaveRequest}</button>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-16 pt-8 text-sm flex flex-col md:flex-row justify-between items-center">
              <p className="mb-4 md:mb-0">&copy; 2026 ZVARYUVALNYK. {t.footer.rights}</p>
              <div className="flex flex-col items-center md:items-end">
                <a href="#" className="hover:text-white transition mb-2">{t.footer.privacy}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}