/**
 * SEO Utilities
 * 
 * Structured data (JSON-LD) generators for better Google indexing
 */

import { StoreConfig, getStoreConfig } from './store-config';

// Organization Schema
export function generateOrganizationSchema(store: StoreConfig = getStoreConfig()) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: store.name,
        url: `https://${store.domain}`,
        logo: store.logo || `https://${store.domain}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            email: store.supportEmail,
            contactType: 'customer service',
        },
        sameAs: Object.values(store.social).filter(Boolean),
    };
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(
    items: { name: string; url: string }[],
    store: StoreConfig = getStoreConfig()
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://${store.domain}${item.url}`,
        })),
    };
}

// FAQ Schema
export function generateFAQSchema(
    faqs: { question: string; answer: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

// Product Schema
export function generateProductSchema(product: {
    name: string;
    description: string;
    price: number;
    currency?: string;
    image?: string;
    sku?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    rating?: { value: number; count: number };
}, store: StoreConfig = getStoreConfig()) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image || `https://${store.domain}/product.jpg`,
        sku: product.sku,
        brand: {
            '@type': 'Brand',
            name: store.name,
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency || 'USD',
            availability: `https://schema.org/${product.availability || 'InStock'}`,
            seller: {
                '@type': 'Organization',
                name: store.name,
            },
        },
        ...(product.rating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating.value,
                reviewCount: product.rating.count,
            },
        }),
    };
}

// Component to inject JSON-LD into the page
export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// Combined schemas for a page
export function generatePageSchemas(
    pageType: 'home' | 'product' | 'about' | 'contact' | 'faq',
    additionalData?: Record<string, unknown>
) {
    const store = getStoreConfig();
    const schemas: Record<string, unknown>[] = [generateOrganizationSchema(store)];

    switch (pageType) {
        case 'home':
            schemas.push(generateBreadcrumbSchema([{ name: 'Home', url: '/' }], store));
            break;
        case 'about':
            schemas.push(generateBreadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' },
            ], store));
            break;
        case 'contact':
            schemas.push(generateBreadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Contact', url: '/contact' },
            ], store));
            break;
    }

    return schemas;
}
