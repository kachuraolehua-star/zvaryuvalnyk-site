import { translations } from "@/lib/translations";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations["uk"];
  return {
    title: t.seo.vacanciesTitle,
    description: t.seo.vacanciesDesc,
  };
}

// Layout is a Server Component — страница остаётся "use client"
export default function VacanciesLayout({ children }) {
  return children;
}
