import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key if available, otherwise fallback to anon key (though admin ops might fail)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
    try {
        const { storeId, newName, newSlug, mode = 'full', userId } = await request.json();

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
            return NextResponse.json({ error: 'Store not found: ' + (storeError?.message || '') }, { status: 404 });
        }

        // Create cloned store
        const clonedStore = {
            name: newName || `${originalStore.name} (Copy)`,
            slug: newSlug || `${originalStore.slug}-copy-${Date.now()}`,
            domain: null, // Don't copy domain
            theme: originalStore.theme,
            // Copy theme colors
            primary_color: originalStore.primary_color,
            accent_color: originalStore.accent_color,
            background_color: originalStore.background_color,
            text_color: originalStore.text_color,
            // Copy JSONB fields
            content: originalStore.content || {},
            theme_settings: originalStore.theme_settings || {},
            // Copy settings that might not exist yet (handle gracefully)
            trust_badge_text: originalStore.trust_badge_text,
            meta_title: originalStore.meta_title,
            meta_description: originalStore.meta_description,
            shipping_rate: originalStore.shipping_rate || 0,
            free_shipping_threshold: originalStore.free_shipping_threshold || 100,
            tax_rate: originalStore.tax_rate || 0,
            tax_included: originalStore.tax_included || false,
            is_active: false, // Start as draft
            user_id: userId || originalStore.user_id, // Prefer passed userId, fallback to original
            user_id: userId || originalStore.user_id, // Prefer passed userId, fallback to original
        };

        const { data: newStore, error: createError } = await supabase
            .from('stores')
            .insert(clonedStore)
            .select()
            .single();

        if (createError) {
            console.error('Store clone error:', createError);
            if (createError.code === '42501') {
                return NextResponse.json({
                    error: 'Permission denied. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the server.'
                }, { status: 403 });
            }
            return NextResponse.json({ error: 'Failed to create store: ' + createError.message }, { status: 500 });
        }

        // Initialize counters
        let productsCloned = 0;
        let discountsCloned = 0;

        // ONLY clone catalog data if mode is 'full'
        if (mode === 'full') {
            // Fetch and clone products
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId);

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
