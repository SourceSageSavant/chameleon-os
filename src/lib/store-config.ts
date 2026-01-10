/**
 * Store Configuration
 * 
 * This will eventually be loaded from Supabase based on the domain.
 * For now, it's a mock config that can be easily replaced.
 */

export interface StoreConfig {
    // Basic info
    name: string;
    domain: string;
    tagline: string;
    description: string;

    // Contact
    email: string;
    supportEmail: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };

    // Social
    social: {
        instagram?: string;
        tiktok?: string;
        twitter?: string;
        facebook?: string;
        youtube?: string;
    };

    // Branding
    logo?: string;
    favicon?: string;
    theme: string;

    // Business policies
    shippingThreshold: number; // Free shipping over this amount
    returnDays: number;

    // SEO
    seo: {
        titleSuffix: string;
        defaultDescription: string;
        ogImage?: string;
    };

    // Product category (for content generation)
    productCategory: string;
    productType: string;
}

// Default store config (Creatine Gummies example)
// In production, this would be loaded from Supabase based on domain
export const defaultStoreConfig: StoreConfig = {
    name: 'CreatinePro',
    domain: 'creatinepro.com',
    tagline: 'Premium Creatine Gummies',
    description: 'NSF Certified creatine gummies with 2.5g per serving. Trusted by athletes.',

    email: 'hello@creatinepro.com',
    supportEmail: 'support@creatinepro.com',

    social: {
        instagram: 'https://instagram.com/creatinepro',
        tiktok: 'https://tiktok.com/@creatinepro',
        twitter: 'https://twitter.com/creatinepro',
    },

    theme: 'organic_v1',

    shippingThreshold: 50,
    returnDays: 30,

    seo: {
        titleSuffix: 'CreatinePro',
        defaultDescription: 'Premium NSF Certified creatine gummies with the highest potency on the market. Made in USA.',
    },

    productCategory: 'Health & Wellness',
    productType: 'Supplements',
};

// Helper to get store config (later will query Supabase)
export function getStoreConfig(): StoreConfig {
    // TODO: Replace with Supabase query based on domain
    return defaultStoreConfig;
}

// Generate SEO metadata for a page
export function generateMetadata(
    page: { title: string; description?: string; path: string },
    store: StoreConfig = defaultStoreConfig
) {
    return {
        title: `${page.title} | ${store.seo.titleSuffix}`,
        description: page.description || store.seo.defaultDescription,
        openGraph: {
            title: `${page.title} | ${store.seo.titleSuffix}`,
            description: page.description || store.seo.defaultDescription,
            url: `https://${store.domain}${page.path}`,
            siteName: store.name,
            type: 'website',
            ...(store.seo.ogImage && { images: [{ url: store.seo.ogImage }] }),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${page.title} | ${store.seo.titleSuffix}`,
            description: page.description || store.seo.defaultDescription,
        },
    };
}
