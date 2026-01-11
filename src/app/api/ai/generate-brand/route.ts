import { NextRequest, NextResponse } from 'next/server';

interface ProductInput {
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

interface GeneratedBrand {
    storeName: string;
    storeSlug: string;
    tagline: string;
    theme: 'organic' | 'minimalist' | 'cyber';
    primaryColor: string;
    accentColor: string;
    trustBadges: string[];
    productTitle: string;
    productDescription: string;
    aboutContent: string;
}

// Theme presets based on category
const categoryThemes: Record<string, { theme: string; colors: { primary: string; accent: string } }> = {
    health: { theme: 'organic', colors: { primary: '#2D5A27', accent: '#8BC34A' } },
    tech: { theme: 'cyber', colors: { primary: '#1a1a2e', accent: '#00d4ff' } },
    fashion: { theme: 'minimalist', colors: { primary: '#1e1e1e', accent: '#c5a572' } },
    beauty: { theme: 'organic', colors: { primary: '#d4a5a5', accent: '#f5e6e0' } },
    home: { theme: 'minimalist', colors: { primary: '#5c4033', accent: '#d9c7b8' } },
    general: { theme: 'minimalist', colors: { primary: '#1e3a5f', accent: '#60a5fa' } },
};

// Generate brand name from product title
function generateBrandName(title: string, category: string): string {
    // Extract key product word
    const words = title.split(' ').filter(w => w.length > 3);
    const productWord = words[0] || 'Store';

    const prefixes: Record<string, string[]> = {
        health: ['Pure', 'Prime', 'Vital', 'Apex', 'Core'],
        tech: ['Nexus', 'Quantum', 'Pulse', 'Volt', 'Sync'],
        fashion: ['Luxe', 'Elite', 'Vogue', 'Chic', 'Nova'],
        beauty: ['Glow', 'Radiant', 'Bloom', 'Aura', 'Velvet'],
        home: ['Haven', 'Casa', 'Nest', 'Cozy', 'Urban'],
        general: ['Prime', 'Select', 'Choice', 'Best', 'Top'],
    };

    const categoryPrefixes = prefixes[category] || prefixes.general;
    const prefix = categoryPrefixes[Math.floor(Math.random() * categoryPrefixes.length)];

    return `${prefix}${productWord.charAt(0).toUpperCase() + productWord.slice(1).toLowerCase()}`;
}

// Generate trust badges based on category
function generateTrustBadges(category: string): string[] {
    const badges: Record<string, string[]> = {
        health: ['Lab Tested', 'GMP Certified', 'Made in USA', '100% Natural'],
        tech: ['1 Year Warranty', 'Fast Shipping', '24/7 Support', 'Secure Checkout'],
        fashion: ['Premium Quality', 'Fast Shipping', 'Easy Returns', 'Authentic'],
        beauty: ['Cruelty-Free', 'Dermatologist Tested', 'Organic', 'Paraben-Free'],
        home: ['Premium Quality', 'Free Shipping', 'Easy Assembly', '30-Day Returns'],
        general: ['Free Shipping', 'Secure Checkout', 'Fast Delivery', 'Easy Returns'],
    };

    return badges[category] || badges.general;
}

export async function POST(request: NextRequest) {
    try {
        const { product }: { product: ProductInput } = await request.json();

        if (!product || !product.title) {
            return NextResponse.json({ error: 'Product data required' }, { status: 400 });
        }

        const category = product.category || 'general';
        const themeConfig = categoryThemes[category] || categoryThemes.general;

        // Generate brand identity
        const storeName = generateBrandName(product.title, category);
        const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Generate taglines based on category
        const taglines: Record<string, string[]> = {
            health: ['Fuel Your Potential', 'Elevate Your Wellness', 'Power Your Performance'],
            tech: ['Innovation Delivered', 'Future-Ready Tech', 'Cutting Edge Solutions'],
            fashion: ['Define Your Style', 'Effortless Elegance', 'Curated for You'],
            beauty: ['Radiate Confidence', 'Your Natural Glow', 'Beauty Redefined'],
            home: ['Make It Home', 'Living Made Beautiful', 'Your Space, Elevated'],
            general: ['Quality You Can Trust', 'Excellence Delivered', 'Premium Selection'],
        };

        const categoryTaglines = taglines[category] || taglines.general;
        const tagline = categoryTaglines[Math.floor(Math.random() * categoryTaglines.length)];

        // Enhance product description
        const enhancedDescription = `${product.description}\n\nExperience the difference with ${storeName}. We're committed to bringing you only the highest quality products with fast, reliable shipping and exceptional customer service.`;

        // Generate about content
        const aboutContent = `Welcome to ${storeName}! We're passionate about bringing you the best ${category === 'general' ? 'products' : category + ' products'} on the market.

Our mission is simple: deliver premium quality at fair prices, with customer satisfaction as our top priority.

Every product in our store is carefully selected to meet our high standards. We believe in transparency, quality, and putting our customers first.

Thank you for choosing ${storeName}. We're here to serve you!`;

        const generatedBrand: GeneratedBrand = {
            storeName,
            storeSlug,
            tagline,
            theme: themeConfig.theme as 'organic' | 'minimalist' | 'cyber',
            primaryColor: themeConfig.colors.primary,
            accentColor: themeConfig.colors.accent,
            trustBadges: generateTrustBadges(category),
            productTitle: product.title,
            productDescription: enhancedDescription,
            aboutContent,
        };

        return NextResponse.json({
            success: true,
            brand: generatedBrand,
            category,
        });

    } catch (error) {
        console.error('Brand generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate brand' },
            { status: 500 }
        );
    }
}
