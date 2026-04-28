/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_UMAMI_ENABLED?: string;
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
  readonly PUBLIC_UMAMI_SRC?: string;
  readonly PUBLIC_ADSENSE_ENABLED?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_BLOG_TOP_SLOT?: string;
  readonly PUBLIC_ADSENSE_BLOG_BOTTOM_SLOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
