import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/billing/subscription - Get current user's subscription
export async function GET() {
    try {
        // In production, get userId from auth session
        const userId = 'current-user'; // TODO: Get from auth

        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error || !subscription) {
            // Return default free plan
            return NextResponse.json({
                plan: 'free',
                status: 'active',
                max_stores: 1,
                max_orders_per_month: 50,
                max_ai_calls_per_month: 100,
            });
        }

        return NextResponse.json(subscription);
    } catch (error) {
        console.error('Subscription API error:', error);
        return NextResponse.json({
            plan: 'free',
            status: 'active',
            max_stores: 1,
            max_orders_per_month: 50,
            max_ai_calls_per_month: 100,
        });
    }
}
