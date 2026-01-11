import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getNextOrderNumber(supabase: any, storeId: string): Promise<string> {
    const { data } = await supabase
        .from('orders')
        .select('order_number')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (data?.order_number) {
        const currentNum = parseInt(String(data.order_number).replace('#', '').replace(/\D/g, ''));
        return `#${(currentNum + 1).toString().padStart(5, '0')}`;
    }

    return '#00001';
}


export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    // Verify webhook signature (CRITICAL for security)
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Extract metadata we stored during create-payment-intent
        const metadata = paymentIntent.metadata;
        const storeId = metadata.store_id || 'default';
        const lineItems = JSON.parse(metadata.line_items || '[]');
        const subtotal = parseFloat(metadata.subtotal || '0');
        const discountAmount = parseFloat(metadata.discount_amount || '0');
        const discountCode = metadata.discount_code || null;
        const shipping = parseFloat(metadata.shipping || '0');
        const total = parseFloat(metadata.total || '0');

        const supabase = getSupabaseAdmin();

        // Idempotency check - prevent duplicate orders
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .single();

        if (existingOrder) {
            console.log('Order already exists for payment intent:', paymentIntent.id);
            return NextResponse.json({ received: true, status: 'already_processed' });
        }

        try {
            // 1. Atomically decrement inventory using our RPC function
            const orderItems = lineItems.map((item: { product_id: string; quantity: number }) => ({
                product_id: item.product_id,
                quantity: item.quantity,
            }));

            const { error: stockError } = await supabase.rpc('decrement_stock', {
                order_items: orderItems,
            });

            if (stockError) {
                console.error('Stock decrement failed:', stockError);
                // In production, you might want to issue a refund here
                return NextResponse.json(
                    { error: 'Inventory error', details: stockError.message },
                    { status: 500 }
                );
            }

            // 2. Create the order
            const orderNumber = await getNextOrderNumber(supabase, storeId);

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    store_id: storeId,
                    order_number: orderNumber,
                    customer_email: paymentIntent.receipt_email || null,
                    customer_name: paymentIntent.shipping?.name || null,
                    line_items: lineItems,
                    subtotal,
                    discount_amount: discountAmount,
                    discount_code: discountCode,
                    shipping_cost: shipping,
                    total,
                    payment_status: 'paid',
                    fulfillment_status: 'unfulfilled',
                    stripe_payment_intent_id: paymentIntent.id,
                })
                .select()
                .single();

            if (orderError) {
                console.error('Order creation failed:', orderError);
                return NextResponse.json(
                    { error: 'Order creation failed' },
                    { status: 500 }
                );
            }

            console.log('Order created successfully:', order.order_number);

            // 3. Send confirmation email (non-blocking)
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                await fetch(`${baseUrl}/api/orders/send-confirmation`, {
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
            } catch (emailError) {
                console.error('Email sending failed (non-critical):', emailError);
            }

            // 4. Increment discount usage if used
            if (discountCode) {
                await supabase
                    .from('discounts')
                    .update({ uses_count: supabase.rpc('increment_uses', { code: discountCode }) })
                    .eq('code', discountCode);
            }

            return NextResponse.json({
                received: true,
                order_id: order.id,
                order_number: order.order_number,
            });

        } catch (error) {
            console.error('Webhook processing error:', error);
            return NextResponse.json(
                { error: 'Processing failed' },
                { status: 500 }
            );
        }
    }

    // Return 200 for events we don't handle
    return NextResponse.json({ received: true });
}

// Disable body parsing - Stripe needs raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};
