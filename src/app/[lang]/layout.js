import GlobalWrapper from "@/components/GlobalWrapper";
import { translations } from "@/lib/translations";

// ДИНАМИЧЕСКИЕ МЕТАТЕГИ ДЛЯ ЯЗЫКОВ
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations['uk'];
  const baseUrl = 'https://zvaryuvalnyk.xyz';
  const canonicalUrl = lang === 'uk' ? baseUrl : `${baseUrl}/${lang}`;

  return {
    title: t.seo.homeTitle,
    description: t.seo.homeDesc,
    // hreflang — говорим Google о всех языковых версиях
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uk': baseUrl,
        'pl': `${baseUrl}/pl`,
        'ru': `${baseUrl}/ru`,
        'en': `${baseUrl}/en`,
      },
    },
    // Open Graph — красивые карточки в Telegram, WhatsApp, Facebook, LinkedIn
    openGraph: {
      title: t.seo.homeTitle,
      description: t.seo.homeDesc,
      url: canonicalUrl,
      siteName: 'Zvaryuvalnyk.xyz',
      type: 'website',
      locale: lang === 'uk' ? 'uk_UA' : lang === 'pl' ? 'pl_PL' : lang === 'ru' ? 'ru_RU' : 'en_US',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t.seo.homeTitle,
        },
      ],
    },
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