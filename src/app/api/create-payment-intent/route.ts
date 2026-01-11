import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
});

// Server-side only Supabase client
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

interface CartItemInput {
    product_id: string;
    quantity: number;
    variant_id?: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Accept structured cart items, NOT raw amount
        const items: CartItemInput[] = body.items;
        const storeId: string | undefined = body.store_id;
        const discountCode: string | undefined = body.discount_code;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Cart items are required' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Fetch product prices from database (THE SECURE WAY)
        const productIds = items.map(item => item.product_id);
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price, title, inventory_quantity')
            .in('id', productIds);

        if (productsError || !products) {
            console.error('Products fetch error:', productsError);
            return NextResponse.json(
                { error: 'Failed to fetch product prices' },
                { status: 500 }
            );
        }

        // Build price map and validate inventory
        const priceMap = new Map<string, { price: number; title: string; stock: number }>();
        for (const product of products) {
            priceMap.set(product.id, {
                price: product.price,
                title: product.title,
                stock: product.inventory_quantity ?? 0,
            });
        }

        // Calculate total using SERVER-SIDE prices (ignore any client-sent amount)
        let subtotal = 0;
        const lineItems: Array<{ product_id: string; title: string; quantity: number; unit_price: number }> = [];

        for (const item of items) {
            const productInfo = priceMap.get(item.product_id);

            if (!productInfo) {
                return NextResponse.json(
                    { error: `Product not found: ${item.product_id}` },
                    { status: 400 }
                );
            }

            // Validate stock
            if (productInfo.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${productInfo.title}. Available: ${productInfo.stock}` },
                    { status: 400 }
                );
            }

            const lineTotal = productInfo.price * item.quantity;
            subtotal += lineTotal;

            lineItems.push({
                product_id: item.product_id,
                title: productInfo.title,
                quantity: item.quantity,
                unit_price: productInfo.price,
            });
        }

        // Apply discount if provided
        let discountAmount = 0;
        if (discountCode) {
            const { data: discount } = await supabase
                .from('discounts')
                .select('*')
                .eq('code', discountCode.toUpperCase())
                .eq('is_active', true)
                .single();

            if (discount) {
                if (discount.type === 'percentage') {
                    discountAmount = subtotal * (discount.value / 100);
                } else if (discount.type === 'fixed') {
                    discountAmount = Math.min(discount.value, subtotal);
                }
            }
        }

        // Calculate shipping (free over $50)
        const shipping = subtotal >= 50 ? 0 : 5.99;

        // Calculate final total
        const total = Math.max(0, subtotal - discountAmount + shipping);
        const amountInCents = Math.round(total * 100);

        // Create PaymentIntent with metadata for webhook to use
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                store_id: storeId || 'default',
                line_items: JSON.stringify(lineItems),
                subtotal: subtotal.toFixed(2),
                discount_amount: discountAmount.toFixed(2),
                discount_code: discountCode || '',
                shipping: shipping.toFixed(2),
                total: total.toFixed(2),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            calculated: {
                subtotal,
                discountAmount,
                shipping,
                total,
            },
        });
    } catch (error) {
        console.error('Payment Intent Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

