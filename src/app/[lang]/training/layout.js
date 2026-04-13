import { translations } from "@/lib/translations";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations["uk"];
  return {
    title: t.seo.trainingTitle,
    description: t.seo.trainingDesc,
  };
}

// Layout is a Server Component — страница остаётся "use client"
export default function TrainingLayout({ children }) {
  return children;
}
