import { useHead, useSeoMeta } from "#imports";

const SITE_URL = "https://www.kompak98.com";
const SITE_NAME = "KOMPAK 98";
const DEFAULT_IMAGE = "/images/logo-horizontal.webp";

interface LandingSeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

function getAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value))
    return value;

  return `${SITE_URL}/${value.replace(/^\/+/, "")}`;
}

export function useLandingSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
}: LandingSeoOptions): void {
  const canonical = path === "/"
    ? `${SITE_URL}/`
    : `${SITE_URL}/${path.replace(/^\/+|\/+$/g, "")}`;
  const imageUrl = getAbsoluteUrl(image);

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogUrl: canonical,
    ogSiteName: SITE_NAME,
    ogLocale: "id_ID",
    ogImage: imageUrl,
    ogImageAlt: `${SITE_NAME} - Everlasting Brotherhood`,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
    twitterImageAlt: `${SITE_NAME} - Everlasting Brotherhood`,
  });

  useHead({
    link: [{ rel: "canonical", href: canonical }],
  });
}

export function useWebsiteStructuredData(): void {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  useHead({
    script: [
      {
        key: "kompak98-structured-data",
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": organizationId,
              "name": SITE_NAME,
              "url": `${SITE_URL}/`,
              "logo": {
                "@type": "ImageObject",
                "url": getAbsoluteUrl(DEFAULT_IMAGE),
              },
              "email": "info@kompak98.org",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jakarta Selatan",
                "addressCountry": "ID",
              },
              "slogan": "Everlasting Brotherhood",
            },
            {
              "@type": "WebSite",
              "@id": websiteId,
              "name": SITE_NAME,
              "url": `${SITE_URL}/`,
              "inLanguage": "id-ID",
              "publisher": { "@id": organizationId },
            },
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/#webpage`,
              "url": `${SITE_URL}/`,
              "name": `${SITE_NAME} | Portal Resmi Alumni`,
              "description": "Portal resmi alumni KOMPAK 98 untuk mempererat silaturahmi, berbagi informasi acara, dan membangun kolaborasi yang bermanfaat.",
              "isPartOf": { "@id": websiteId },
              "about": { "@id": organizationId },
              "inLanguage": "id-ID",
            },
          ],
        }),
      },
    ],
  });
}
