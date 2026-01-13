import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe Price IDs - You'll need to create these in Stripe Dashboard
// For testing, we'll create checkout sessions with ad-hoc prices
const PLAN_PRICES: Record<string, { monthly: number; name: string }> = {
    starter: { monthly: 2900, name: 'Starter Plan' },
    pro: { monthly: 7900, name: 'Pro Plan' },
    enterprise: { monthly: 19900, name: 'Enterprise Plan' },
};

export async function POST(request: NextRequest) {
    try {
        // Initialize Stripe inside handler to avoid build-time errors
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe is not configured' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover' as Stripe.LatestApiVersion,
        });

        const { planId } = await request.json();

        if (!planId || !PLAN_PRICES[planId]) {
            return NextResponse.json(
                { error: 'Invalid plan selected' },
                { status: 400 }
            );
        }

        const plan = PLAN_PRICES[planId];
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan.name,
                            description: `ChameleonOS ${plan.name} - Monthly Subscription`,
                        },
                        unit_amount: plan.monthly,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}/admin/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/admin/billing?canceled=true`,
            metadata: {
                plan_id: planId,
                platform: 'chameleon_commerce_os',
            },
            subscription_data: {
                metadata: {
                    plan_id: planId,
                },
            },
            // Allow promotion codes
            allow_promotion_codes: true,
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });

    } catch (error) {
        console.error('Checkout session error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
