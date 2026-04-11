"use client";

import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '@/components/GlobalWrapper';
import { MapPin, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

export default function VacanciesPage() {
  const { t, setShowModal } = useContext(AppContext);
  const [activeVacancy, setActiveVacancy] = useState(null);

  // Скидаємо скрол наверх при зміні вакансії
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeVacancy]);

  // ДЕТАЛЬНИЙ ПЕРЕГЛЯД ВАКАНСІЇ
  if (activeVacancy) {
    return (
      <div className="py-12 bg-slate-50 min-h-[80vh] animate-[fadeInUp_0.3s_ease-out]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setActiveVacancy(null)} 
            className="flex items-center text-gray-500 hover:text-slate-900 mb-6 font-medium transition"
          >
            <ChevronRight size={20} className="rotate-180 mr-1" /> {t.vacancyDetail.back}
          </button>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 pb-8 md:pb-12">
            <div className="h-64 md:h-80 w-full relative mb-8">
              <img 
                src={activeVacancy === 'mig_mag' ? "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80" : "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
                alt="Вакансія" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-yellow-500 text-black font-extrabold text-sm rounded-lg mb-3 shadow-lg">HOT ВАКАНСІЯ</div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                    {activeVacancy === 'mig_mag' ? t.vacancies.v1t : t.vacancies.v2t}
                  </h1>
                  <p className="flex items-center text-gray-300 text-lg">
                    <MapPin size={20} className="mr-2" /> {activeVacancy === 'mig_mag' ? t.vacancies.v1loc : t.vacancies.v2loc}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center md:text-right flex-shrink-0 shadow-2xl">
                  <p className="text-yellow-400 text-sm mb-1 uppercase tracking-wider font-bold">{t.vacancies.rate}</p>
                  <p className="text-4xl font-extrabold text-white">{activeVacancy === 'mig_mag' ? '38' : `${t.vacancies.from}28`} zł</p>
                  <p className="text-base font-normal text-gray-300 mt-1">{t.vacancies.net}</p>
                </div>
              </div>
            </div>

            <div className="px-8 md:px-12">
              <div className="grid md:grid-cols-2 gap-10 mb-12">
                <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><CheckCircle2 className="text-green-500 mr-2"/> {t.vacancyDetail.reqs}</h3>
                  <ul className="space-y-4 text-gray-700 text-lg">
                    {activeVacancy === 'mig_mag' ? (
                      <>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Досвід роботи методом 135/136 від 1 року;</li>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Вміння читати креслення (базовий рівень);</li>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Відповідальність та відсутність шкідливих звичок;</li>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Бажання працювати і заробляти.</li>
                      </>
                    ) : (
                      <>
                        {/* ТУТ БУЛА ПОМИЛКА: замінили апостроф на &apos; */}
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Вміння читати технічні креслення (обов&apos;язково);</li>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Досвід роботи зі слюсарним інструментом;</li>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Вміння працювати в команді;</li>
                        <li className="flex"><span className="text-yellow-500 mr-2 font-bold">•</span> Базові навички зварювання (як плюс).</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><ShieldCheck className="text-yellow-500 mr-2"/> {t.vacancyDetail.conds}</h3>
                  <ul className="space-y-4 text-gray-700 text-lg">
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.benefits.b1d}</li>
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.benefits.b2d}</li>
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.benefits.b3d}</li>
                    <li className="flex"><span className="text-green-500 mr-2 font-bold">✓</span> {t.benefits.b4d}</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-8 md:p-10 rounded-2xl border border-yellow-200 flex flex-col md:flex-row items-center justify-between shadow-sm">
                <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
                  <h4 className="font-bold text-slate-900 text-3xl mb-3">{t.vacancyDetail.applyText}</h4>
                  <p className="text-gray-600 text-lg">Наш рекрутер відповість на всі запитання та допоможе з швидким оформленням документів.</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="w-full md:w-auto text-black px-12 py-5 rounded-xl font-extrabold text-xl hover:brightness-110 transition whitespace-nowrap shadow-xl shadow-yellow-500/30 hover:-translate-y-1" 
                  style={{ backgroundColor: 'rgb(234, 179, 8)' }}
                >
                  {t.header.leaveRequest}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // СПИСОК ВАКАНСІЙ (За замовчуванням)
  return (
    <div className="py-12 bg-slate-50 min-h-[80vh] animate-[fadeInUp_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.vacancies.title}</h1>
          <p className="text-xl text-gray-600">{t.vacancies.desc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Вакансія 1 */}
          <div 
            onClick={() => setActiveVacancy('mig_mag')}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl transition-all flex flex-col md:flex-row group cursor-pointer"
          >
            <div className="md:w-2/5 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80" alt="Зварювальник MIG/MAG" className="w-full h-48 md:h-full object-cover bg-gray-200 transition-transform duration-700 group-hover:scale-110" />
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
          </div>

          {/* Вакансія 2 */}
          <div 
            onClick={() => setActiveVacancy('slyusar')}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl transition-all flex flex-col md:flex-row group cursor-pointer"
          >
            <div className="md:w-2/5 relative bg-slate-200 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Слюсар" className="w-full h-48 md:h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
          </div>
        </div>
      </div>
    </div>
  );
}