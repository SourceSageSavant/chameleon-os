import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
    }

    return createClient(supabaseUrl, supabaseKey);
}

async function getNextOrderNumber(supabase: any, storeId: string): Promise<string> {
    // Get the highest order number for this store
    const { data } = await supabase
        .from('orders')
        .select('order_number')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (data?.order_number) {
        const currentNum = parseInt(data.order_number.replace('#', '').replace(/\D/g, ''));
        return `#${(currentNum + 1).toString().padStart(5, '0')}`;
    }

    return '#00001';
}

export async function POST(request: NextRequest) {
    try {
        // Initialize Stripe inside handler to avoid build-time errors
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const { payment_intent_id, line_items, subtotal, shipping_cost, total } = await request.json();

        if (!payment_intent_id) {
            return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
        }

        const supabase = getSupabaseClient();

        // Get the first active store (in production, this would be determined by domain)
        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single();

        const storeId = store?.id;

        if (!storeId) {
            return NextResponse.json({ error: 'No active store found' }, { status: 400 });
        }

        // Generate order number
        const orderNumber = await getNextOrderNumber(supabase, storeId);

        // Create order in database
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                store_id: storeId,
                order_number: orderNumber,
                customer_email: paymentIntent.receipt_email || paymentIntent.metadata?.email || null,
                customer_name: paymentIntent.shipping?.name || paymentIntent.metadata?.name || null,
                line_items: line_items || [],
                subtotal: subtotal || (paymentIntent.amount / 100),
                shipping_cost: shipping_cost || 0,
                total: total || (paymentIntent.amount / 100),
                payment_status: 'paid',
                fulfillment_status: 'unfulfilled',
                stripe_payment_intent_id: payment_intent_id,
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order creation error:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // Decrement inventory for each line item
        if (line_items && Array.isArray(line_items)) {
            for (const item of line_items) {
                if (item.product_id) {
                    // Get current inventory
                    const { data: product } = await supabase
                        .from('products')
                        .select('inventory_quantity')
                        .eq('id', item.product_id)
                        .single();

                    if (product) {
                        const newQuantity = Math.max(0, (product.inventory_quantity || 0) - (item.quantity || 1));
                        await supabase
                            .from('products')
                            .update({ inventory_quantity: newQuantity })
                            .eq('id', item.product_id);
                    }
                }
            }
        }

        // Send confirmation email (non-blocking)
        try {
            const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/orders/send-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: order.order_number,
                    customerEmail: order.customer_email,
                    customerName: order.customer_name,
                    lineItems: order.line_items,
                    subtotal: order.subtotal,
                    shipping: order.shipping_cost,
                    total: order.total,
                    storeName: 'Store',
                }),
            });
            console.log('Email sent:', await emailResponse.json());
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the order if email fails
        }

        return NextResponse.json({
            success: true,
            order_id: order.id,
            order_number: order.order_number,
            customer_email: order.customer_email,
            total: order.total,
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
