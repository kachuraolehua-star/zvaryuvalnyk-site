"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lock, Edit, Plus, Trash2, ChevronLeft } from 'lucide-react';

export default function AdminPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  const [adminLang, setAdminLang] = useState('uk');
  const [blogPosts, setBlogPosts] = useState([]);

  // Форма створення / редагування
  const [editingPostId, setEditingPostId] = useState(null);
  const [newPostDate, setNewPostDate] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostTitle, setNewPostTitle] = useState({ uk: "", pl: "", ru: "", en: "" });
  const [newPostSeoTitle, setNewPostSeoTitle] = useState({ uk: "", pl: "", ru: "", en: "" });
  const [newPostExcerpt, setNewPostExcerpt] = useState({ uk: "", pl: "", ru: "", en: "" });
  const [newPostContent, setNewPostContent] = useState({ uk: "", pl: "", ru: "", en: "" });

  const getPostText = (postObj, field) => {
    if (!postObj || !postObj[field]) return "";
    if (typeof postObj[field] === 'string') return postObj[field];
    return postObj[field]['uk'] || '';
  };

  const parseMultiLang = (val) => {
    if (typeof val === 'string') return { uk: val, pl: "", ru: "", en: "" };
    return val || { uk: "", pl: "", ru: "", en: "" };
  };

  // Завантаження статей
  useEffect(() => {
    if (!db) return;
    const postsRef = collection(db, 'blogPosts');
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const loadedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedPosts.sort((a, b) => b.createdAt - a.createdAt);
      setBlogPosts(loadedPosts);
    }, (error) => console.error("Firestore error:", error));
    return () => unsubscribe();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Той самий секретний пароль
    if (adminLogin === 'admin' && adminPass === 'zvaryar2026') {
      setIsAdminAuthenticated(true);
    } else {
      alert('Невірний логін або пароль!');
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setNewPostDate(post.date || "");
    setNewPostImage(post.image || "");
    setNewPostTitle(parseMultiLang(post.title));
    setNewPostSeoTitle(parseMultiLang(post.seoTitle));
    setNewPostExcerpt(parseMultiLang(post.excerpt));
    setNewPostContent(parseMultiLang(post.content));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setNewPostDate(""); setNewPostImage("");
    setNewPostTitle({ uk: "", pl: "", ru: "", en: "" });
    setNewPostSeoTitle({ uk: "", pl: "", ru: "", en: "" });
    setNewPostExcerpt({ uk: "", pl: "", ru: "", en: "" });
    setNewPostContent({ uk: "", pl: "", ru: "", en: "" });
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.uk || !newPostDate) {
      alert("Українська версія заголовка та дата обов'язкові!");
      return;
    }
    
    const postData = {
      date: newPostDate,
      image: newPostImage || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
      title: newPostTitle,
      seoTitle: newPostSeoTitle,
      excerpt: newPostExcerpt,
      content: newPostContent,
      updatedAt: Date.now()
    };

    try {
      if (editingPostId) {
        await updateDoc(doc(db, 'blogPosts', editingPostId), postData);
      } else {
        postData.createdAt = Date.now();
        await addDoc(collection(db, 'blogPosts'), postData);
      }
      cancelEdit();
      alert("Збережено успішно!");
    } catch (error) {
      alert("Помилка збереження: " + error.message);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Дійсно видалити статтю?")) {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
      } catch (error) {
        alert("Помилка видалення: " + error.message);
      }
    }
  };
  
  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (window.confirm("Ви впевнені, що хочете імпортувати статті з цього файлу?")) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const importedData = JSON.parse(event.target.result);
            if (!Array.isArray(importedData)) throw new Error("Файл має бути масивом.");
            
            let count = 0;
            for (const article of importedData) {
                const postData = {
                    date: article.date || "",
                    image: article.image || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
                    title: parseMultiLang(article.title),
                    seoTitle: parseMultiLang(article.seoTitle),
                    excerpt: parseMultiLang(article.excerpt),
                    content: parseMultiLang(article.content),
                    createdAt: Date.now() - (count * 1000),
                    updatedAt: Date.now()
                };
                if (db) await addDoc(collection(db, 'blogPosts'), postData);
                count++;
            }
            alert(`✅ Успішно завантажено статей: ${count}`);
          } catch (error) {
            alert("❌ Помилка імпорту: " + error.message);
          }
          e.target.value = null; 
        };
        reader.readAsText(file);
    } else {
        e.target.value = null;
    }
  };

  // ----- РЕНДЕР СТОРІНКИ -----
  return (
    <div className="py-12 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
            <Lock size={28} className="mr-2" /> Панель Адміністратора
          </h1>
          <Link href="/" className="bg-white text-gray-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-gray-50 transition border border-gray-200 flex items-center">
            <ChevronLeft size={16} className="mr-1" /> Повернутись на сайт
          </Link>
        </div>

        {!isAdminAuthenticated ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-16 max-w-md mx-auto text-center animate-[fadeInUp_0.3s_ease-out]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Вхід до системи</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Логін" 
                  value={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" 
                  required 
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="Пароль" 
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" 
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition shadow-md">
                Увійти
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            {!db && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-8 text-sm">
                <strong>Увага:</strong> База даних не підключена.
              </div>
            )}

            {/* РЕДАКТОР СТАТТІ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  {editingPostId ? <Edit size={20} className="mr-2 text-yellow-600" /> : <Plus size={20} className="mr-2 text-green-600" />} 
                  {editingPostId ? 'Редагувати статтю' : 'Створити нову статтю'}
                </h2>
                <div className="flex items-center space-x-3">
                    {!editingPostId && (
                        <>
                            <input type="file" id="json-upload" accept=".json" className="hidden" onChange={handleBulkImport} />
                            <label htmlFor="json-upload" className="cursor-pointer text-sm text-slate-700 font-bold bg-slate-200 px-4 py-2 rounded-lg hover:bg-slate-300 transition flex items-center">
                              📥 Масовий імпорт
                            </label>
                        </>
                    )}
                    {editingPostId && (
                      <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-slate-900 font-bold transition bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">
                        ✕ Скасувати
                      </button>
                    )}
                </div>
              </div>
              
              <div className="mb-6 border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-2">Оберіть мову для заповнення полів:</p>
                <div className="flex space-x-2">
                  {['uk', 'pl', 'ru', 'en'].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setAdminLang(l)}
                      className={`px-5 py-2 rounded-lg font-bold text-sm uppercase transition ${adminLang === l ? 'bg-yellow-500 text-black shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSavePost} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Заголовок ({adminLang.toUpperCase()}) {adminLang === 'uk' && '*'}
                    </label>
                    <input 
                      type="text" 
                      value={newPostTitle[adminLang] || ""}
                      onChange={(e) => setNewPostTitle({...newPostTitle, [adminLang]: e.target.value})}
                      placeholder="Візуальний заголовок статті..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата публікації *</label>
                    <input 
                      type="text" 
                      value={newPostDate}
                      onChange={(e) => setNewPostDate(e.target.value)}
                      placeholder="ДД.ММ.РРРР"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title (Для Google) ({adminLang.toUpperCase()})
                  </label>
                  <input 
                    type="text" 
                    value={newPostSeoTitle[adminLang] || ""}
                    onChange={(e) => setNewPostSeoTitle({...newPostSeoTitle, [adminLang]: e.target.value})}
                    placeholder="Оптимізований заголовок..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Картинки</label>
                  <input 
                    type="url" 
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm transition" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Коротка анотація ({adminLang.toUpperCase()})</label>
                  <textarea 
                    value={newPostExcerpt[adminLang] || ""}
                    onChange={(e) => setNewPostExcerpt({...newPostExcerpt, [adminLang]: e.target.value})}
                    placeholder="Коротко про що стаття (2-3 речення)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none h-24 transition" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Повний текст статті ({adminLang.toUpperCase()})</label>
                  <textarea 
                    value={newPostContent[adminLang] || ""}
                    onChange={(e) => setNewPostContent({...newPostContent, [adminLang]: e.target.value})}
                    placeholder="Напишіть тут повний текст..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-y h-64 transition" 
                  />
                </div>

                <button type="submit" className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg w-full md:w-auto hover:-translate-y-1">
                  {editingPostId ? 'Зберегти зміни' : 'Опублікувати статтю'}
                </button>
              </form>
            </div>

            {/* СПИСОК СТАТЕЙ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Список ваших статей ({blogPosts.length})</h2>
              <div className="space-y-3">
                {blogPosts.map(post => (
                  <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl gap-4 hover:shadow-md transition">
                    <div className="flex items-center">
                      <img src={post.image} className="w-16 h-16 rounded-lg object-cover mr-4 shadow-sm" alt="thumb"/>
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">{post.date}</p>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{getPostText(post, 'title') || 'Без заголовка'}</h4>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(post)}
                        className="p-3 text-slate-600 hover:bg-white hover:text-yellow-600 hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition"
                        title="Редагувати"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-3 text-red-500 hover:bg-red-50 hover:shadow-sm border border-transparent hover:border-red-100 rounded-lg transition"
                        title="Видалити"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}