import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { storeId, newName, newSlug } = await request.json();

        if (!storeId) {
            return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
        }

        // Fetch original store
        const { data: originalStore, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .eq('id', storeId)
            .single();

        if (storeError || !originalStore) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // Create cloned store
        const clonedStore = {
            name: newName || `${originalStore.name} (Copy)`,
            slug: newSlug || `${originalStore.slug}-copy-${Date.now()}`,
            domain: null, // Don't copy domain
            theme: originalStore.theme,
            primary_color: originalStore.primary_color,
            accent_color: originalStore.accent_color,
            background_color: originalStore.background_color,
            text_color: originalStore.text_color,
            trust_badge_text: originalStore.trust_badge_text,
            meta_title: originalStore.meta_title,
            meta_description: originalStore.meta_description,
            shipping_rate: originalStore.shipping_rate,
            free_shipping_threshold: originalStore.free_shipping_threshold,
            tax_rate: originalStore.tax_rate,
            tax_included: originalStore.tax_included,
            is_active: false, // Start as draft
        };

        const { data: newStore, error: createError } = await supabase
            .from('stores')
            .insert(clonedStore)
            .select()
            .single();

        if (createError) {
            console.error('Store clone error:', createError);
            return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
        }

        // Fetch and clone products
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', storeId);

        let productsCloned = 0;

        if (products && products.length > 0) {
            const clonedProducts = products.map(product => ({
                store_id: newStore.id,
                title: product.title,
                slug: product.slug,
                description: product.description,
                price: product.price,
                compare_at_price: product.compare_at_price,
                images: product.images,
                badges: product.badges,
                inventory_quantity: product.inventory_quantity,
                is_active: product.is_active,
                is_featured: product.is_featured,
            }));

            const { data: insertedProducts, error: productsError } = await supabase
                .from('products')
                .insert(clonedProducts)
                .select();

            if (!productsError && insertedProducts) {
                productsCloned = insertedProducts.length;
            }
        }

        // Clone discounts
        const { data: discounts } = await supabase
            .from('discounts')
            .select('*')
            .eq('store_id', storeId);

        let discountsCloned = 0;

        if (discounts && discounts.length > 0) {
            const clonedDiscounts = discounts.map(discount => ({
                store_id: newStore.id,
                code: discount.code,
                type: discount.type,
                value: discount.value,
                min_order_amount: discount.min_order_amount,
                max_uses: discount.max_uses,
                uses_count: 0, // Reset usage count
                expires_at: discount.expires_at,
                is_active: discount.is_active,
            }));

            const { data: insertedDiscounts, error: discountsError } = await supabase
                .from('discounts')
                .insert(clonedDiscounts)
                .select();

            if (!discountsError && insertedDiscounts) {
                discountsCloned = insertedDiscounts.length;
            }
        }

        return NextResponse.json({
            success: true,
            newStore: {
                id: newStore.id,
                name: newStore.name,
                slug: newStore.slug,
            },
            cloned: {
                products: productsCloned,
                discounts: discountsCloned,
            },
        });

    } catch (error) {
        console.error('Clone error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
