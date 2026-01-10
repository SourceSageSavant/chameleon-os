import type { Product } from '@/types';

// Mock products data (replace with Supabase/Medusa later)
export const mockProducts: Product[] = [
    {
        id: 'creatine-gummies-30',
        store_id: 'default',
        title: 'Premium Creatine Gummies',
        slug: 'creatine-gummies',
        description: `The only creatine gummy with 2.5g per serving. NSF Certified for Sport.

**Why Choose Our Gummies?**
- 2.5g creatine per gummy (highest on the market)
- Only 2 gummies for your full daily dose
- NSF Certified for Sport - trusted by Olympic athletes
- Made with Creapure® German creatine monohydrate
- No artificial colors, no maltodextrin, no fillers
- Delicious mixed berry flavor

**How to Use:**
Take 2 gummies daily, preferably after your workout or with a meal.

**What's Inside:**
- Creatine Monohydrate (Creapure®): 5g per serving
- Natural flavors and colors from fruits
- No banned substances (NSF verified)`,
        price: 34.99,
        compare_at_price: 49.99,
        images: [
            '/products/creatine-gummies-1.png',
            '/products/creatine-gummies-2.png',
            '/products/creatine-gummies-3.png',
        ],
        variants: [
            {
                id: 'var-30',
                title: '30 Day Supply',
                price: 34.99,
                sku: 'CG-30',
                inventory_quantity: 150,
            },
            {
                id: 'var-60',
                title: '60 Day Supply (Save 15%)',
                price: 59.49,
                sku: 'CG-60',
                inventory_quantity: 75,
            },
            {
                id: 'var-90',
                title: '90 Day Supply (Save 25%)',
                price: 78.74,
                sku: 'CG-90',
                inventory_quantity: 50,
            },
        ],
        metadata: {
            servings: 30,
            flavor: 'Mixed Berry',
            certifications: ['NSF Certified for Sport', 'GMP Certified', 'Made in USA'],
        },
        created_at: new Date().toISOString(),
    },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
    return mockProducts.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
    return mockProducts;
}

export function getProductById(id: string): Product | undefined {
    return mockProducts.find((p) => p.id === id);
}
