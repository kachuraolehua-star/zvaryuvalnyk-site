import GlobalWrapper from "@/components/GlobalWrapper";
import { translations } from "@/lib/translations";

// ДИНАМИЧЕСКИЕ МЕТАТЕГИ ДЛЯ ЯЗЫКОВ
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations['uk'];
  
  return {
    title: t.seo.homeTitle,
    description: t.seo.homeDesc,
  };
}

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;

  return (
    <html 
      lang={lang} 
      style={{ scrollBehavior: 'smooth' }} 
      data-scroll-behavior="smooth" 
      suppressHydrationWarning
    >
      <body>
        <GlobalWrapper>{children}</GlobalWrapper>
      </body>
    </html>
  );
}