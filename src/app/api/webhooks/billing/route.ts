import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover' as Stripe.LatestApiVersion,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan limits mapping
const PLAN_LIMITS: Record<string, { stores: number; orders: number; ai: number }> = {
    free: { stores: 1, orders: 50, ai: 100 },
    starter: { stores: 3, orders: 500, ai: 1000 },
    pro: { stores: 10, orders: 2000, ai: 5000 },
    enterprise: { stores: -1, orders: -1, ai: -1 }, // -1 = unlimited
};

export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig || !process.env.STRIPE_BILLING_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_BILLING_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const planId = session.metadata?.plan_id || 'starter';
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                // Get or create user - in production, link to auth user
                const userId = session.client_reference_id || 'default-user';
                const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;

                // Upsert subscription
                await supabase
                    .from('subscriptions')
                    .upsert({
                        user_id: userId,
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                        plan: planId,
                        status: 'active',
                        max_stores: limits.stores,
                        max_orders_per_month: limits.orders,
                        max_ai_calls_per_month: limits.ai,
                        current_period_start: new Date().toISOString(),
                        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'user_id',
                    });

                console.log(`Subscription created/updated for user ${userId}: ${planId}`);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const planId = subscription.metadata?.plan_id || 'starter';
                const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;

                await supabase
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        plan: planId,
                        max_stores: limits.stores,
                        max_orders_per_month: limits.orders,
                        max_ai_calls_per_month: limits.ai,
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                // Downgrade to free
                const freeLimits = PLAN_LIMITS.free;
                await supabase
                    .from('subscriptions')
                    .update({
                        status: 'canceled',
                        plan: 'free',
                        max_stores: freeLimits.stores,
                        max_orders_per_month: freeLimits.orders,
                        max_ai_calls_per_month: freeLimits.ai,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;

                await supabase
                    .from('subscriptions')
                    .update({
                        status: 'past_due',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_customer_id', invoice.customer as string);

                break;
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
