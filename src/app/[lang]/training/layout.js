import { translations } from "@/lib/translations";

const baseUrl = 'https://zvaryuvalnyk.xyz';
const route   = '/training';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations["uk"];
  const canonicalUrl = lang === 'uk' ? `${baseUrl}${route}` : `${baseUrl}/${lang}${route}`;

  return {
    title: t.seo.trainingTitle,
    description: t.seo.trainingDesc,
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
export default function TrainingLayout({ children }) {
  return children;
}
