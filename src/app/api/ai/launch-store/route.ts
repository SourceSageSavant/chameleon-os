import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LaunchRequest {
    brand: {
        storeName: string;
        storeSlug: string;
        tagline: string;
        theme: string;
        primaryColor: string;
        accentColor: string;
        trustBadges: string[];
        productTitle: string;
        productDescription: string;
        aboutContent: string;
    };
    product: {
        title: string;
        description: string;
        price: number;
        images: string[];
    };
}

export async function POST(request: NextRequest) {
    try {
        const { brand, product }: LaunchRequest = await request.json();

        if (!brand || !product) {
            return NextResponse.json({ error: 'Brand and product data required' }, { status: 400 });
        }

        // Create the store
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .insert({
                name: brand.storeName,
                slug: brand.storeSlug,
                domain: null,
                theme: brand.theme,
                primary_color: brand.primaryColor,
                accent_color: brand.accentColor,
                background_color: '#ffffff',
                text_color: '#1a1a1a',
                trust_badge_text: brand.trustBadges[0] || 'Free Shipping',
                meta_title: `${brand.storeName} - ${brand.tagline}`,
                meta_description: brand.productDescription.substring(0, 160),
                is_active: true,
                shipping_rate: 5.99,
                free_shipping_threshold: 50,
                tax_rate: 0,
                tax_included: false,
            })
            .select()
            .single();

        if (storeError) {
            console.error('Store creation error:', storeError);
            return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
        }

        // Generate product slug
        const productSlug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);

        // Create the product
        const { data: createdProduct, error: productError } = await supabase
            .from('products')
            .insert({
                store_id: store.id,
                title: brand.productTitle,
                slug: productSlug,
                description: brand.productDescription,
                price: product.price || 29.99,
                compare_at_price: product.price ? Math.round(product.price * 1.4 * 100) / 100 : null,
                images: product.images || [],
                badges: brand.trustBadges.slice(0, 2),
                inventory_quantity: 100,
                is_active: true,
                is_featured: true,
            })
            .select()
            .single();

        if (productError) {
            console.error('Product creation error:', productError);
            // Still return success - store was created
        }

        // Create a welcome discount code
        await supabase
            .from('discounts')
            .insert({
                store_id: store.id,
                code: 'WELCOME10',
                type: 'percentage',
                value: 10,
                min_order_amount: 0,
                max_uses: 100,
                uses_count: 0,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                is_active: true,
            });

        return NextResponse.json({
            success: true,
            store: {
                id: store.id,
                name: store.name,
                slug: store.slug,
                theme: store.theme,
            },
            product: createdProduct ? {
                id: createdProduct.id,
                title: createdProduct.title,
                slug: createdProduct.slug,
            } : null,
            urls: {
                admin: `/admin/stores/${store.id}`,
                storefront: `/`,
                product: `/products/${productSlug}`,
            },
        });

    } catch (error) {
        console.error('Launch error:', error);
        return NextResponse.json(
            { error: 'Failed to launch store' },
            { status: 500 }
        );
    }
}
