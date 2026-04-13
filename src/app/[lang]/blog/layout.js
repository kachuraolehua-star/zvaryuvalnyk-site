import { translations } from "@/lib/translations";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations["uk"];
  return {
    title: t.seo.blogTitle,
    description: t.seo.blogDesc,
  };
}

// Layout is a Server Component — страница остаётся "use client"
// Не путать с blog/[id]/layout.js — тот для отдельных статей
export default function BlogIndexLayout({ children }) {
  return children;
}
