import { translations } from "@/lib/translations";

const baseUrl = 'https://zvaryuvalnyk.xyz';
const route   = '/blog';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations["uk"];
  const canonicalUrl = lang === 'uk' ? `${baseUrl}${route}` : `${baseUrl}/${lang}${route}`;

  return {
    title: t.seo.blogTitle,
    description: t.seo.blogDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uk': `${baseUrl}${route}`,
        'pl': `${baseUrl}/pl${route}`,
        'ru': `${baseUrl}/ru${route}`,
        'en': `${baseUrl}/en${route}`,
      },
    },
  };
}

// Layout is a Server Component — страница остаётся "use client"
// Не путать с blog/[id]/layout.js — тот для отдельных статей
export default function BlogIndexLayout({ children }) {
  return children;
}
