import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/billing/plans - List all available plans
export async function GET() {
    try {
        const { data: plans, error } = await supabase
            .from('plans')
            .select('*')
            .order('price_monthly', { ascending: true });

        if (error) {
            console.error('Plans fetch error:', error);
            return NextResponse.json({ plans: [] });
        }

        // Parse features JSON
        const formattedPlans = plans.map(plan => ({
            ...plan,
            features: typeof plan.features === 'string'
                ? JSON.parse(plan.features)
                : plan.features,
        }));

        return NextResponse.json({ plans: formattedPlans });
    } catch (error) {
        console.error('Plans API error:', error);
        return NextResponse.json({ plans: [] });
    }
}
