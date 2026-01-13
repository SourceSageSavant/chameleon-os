import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Helper to get initialized clients
function getClients() {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return null;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover' as Stripe.LatestApiVersion,
    });

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    return { stripe, supabase };
}

/**
 * Creates a Stripe Connect Express account for a store owner
 * and returns an onboarding link
 */
export async function POST(request: NextRequest) {
    const clients = getClients();
    if (!clients) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }
    const { stripe, supabase } = clients;

    try {
        const { storeId, email, businessName, returnUrl } = await request.json();

        if (!storeId || !email) {
            return NextResponse.json(
                { error: 'Store ID and email are required' },
                { status: 400 }
            );
        }

        // Check if store already has a connected account
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id, name, stripe_account_id')
            .eq('id', storeId)
            .single();

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        let accountId = store.stripe_account_id;

        // Create new Stripe account if none exists
        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                email: email,
                business_type: 'individual',
                business_profile: {
                    name: businessName || store.name,
                    product_description: 'E-commerce store powered by ChameleonOS',
                },
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                metadata: {
                    store_id: storeId,
                    platform: 'chameleon_commerce_os',
                },
            });

            accountId = account.id;

            // Save the account ID to the store
            await supabase
                .from('stores')
                .update({ stripe_account_id: accountId })
                .eq('id', storeId);
        }

        // Generate onboarding link
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${baseUrl}/admin/stores/${storeId}/connect?refresh=true`,
            return_url: returnUrl || `${baseUrl}/admin/stores/${storeId}/connect?success=true`,
            type: 'account_onboarding',
        });

        return NextResponse.json({
            success: true,
            accountId,
            onboardingUrl: accountLink.url,
        });

    } catch (error) {
        console.error('Stripe Connect error:', error);
        return NextResponse.json(
            { error: 'Failed to create connected account' },
            { status: 500 }
        );
    }
}

/**
 * Get account status for a store
 */
export async function GET(request: NextRequest) {
    const clients = getClients();
    if (!clients) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }
    const { stripe, supabase } = clients;

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
        return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
    }

    try {
        const { data: store } = await supabase
            .from('stores')
            .select('stripe_account_id, payouts_enabled')
            .eq('id', storeId)
            .single();

        if (!store?.stripe_account_id) {
            return NextResponse.json({
                connected: false,
                payoutsEnabled: false,
            });
        }

        // Get account details from Stripe
        const account = await stripe.accounts.retrieve(store.stripe_account_id);

        // Update payouts_enabled in database if changed
        if (account.payouts_enabled !== store.payouts_enabled) {
            await supabase
                .from('stores')
                .update({ payouts_enabled: account.payouts_enabled })
                .eq('id', storeId);
        }

        return NextResponse.json({
            connected: true,
            accountId: store.stripe_account_id,
            payoutsEnabled: account.payouts_enabled,
            chargesEnabled: account.charges_enabled,
            detailsSubmitted: account.details_submitted,
        });

    } catch (error) {
        console.error('Account status error:', error);
        return NextResponse.json(
            { error: 'Failed to get account status' },
            { status: 500 }
        );
    }
}
