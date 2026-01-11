import { MetadataRoute } from 'next';
import { US_CITIES } from '@/lib/cities';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages = [
        '',
        '/products',
        '/about',
        '/contact',
        '/shipping',
        '/returns',
        '/privacy',
        '/terms',
        '/locations',
    ];

    const staticRoutes: MetadataRoute.Sitemap = staticPages.map(path => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.7,
    }));

    // City location pages (programmatic SEO)
    const cityRoutes: MetadataRoute.Sitemap = US_CITIES.map(city => ({
        url: `${BASE_URL}/locations/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // TODO: Add product pages dynamically
    // const products = await fetchProducts();
    // const productRoutes = products.map(p => ({
    //     url: `${BASE_URL}/products/${p.slug}`,
    //     lastModified: new Date(p.updated_at),
    //     priority: 0.8,
    // }));

    return [...staticRoutes, ...cityRoutes];
}
