import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return null;
    }

    return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
    try {
        const { code, subtotal } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Discount code is required' }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Find the discount code
        const { data: discount, error } = await supabase
            .from('discounts')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !discount) {
            return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 });
        }

        // Check expiration
        if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
            return NextResponse.json({ error: 'This discount code has expired' }, { status: 400 });
        }

        // Check max uses
        if (discount.max_uses && discount.uses_count >= discount.max_uses) {
            return NextResponse.json({ error: 'This discount code has reached its usage limit' }, { status: 400 });
        }

        // Check minimum order amount
        if (discount.min_order_amount && subtotal < discount.min_order_amount) {
            return NextResponse.json({
                error: `Minimum order of $${discount.min_order_amount.toFixed(2)} required for this code`
            }, { status: 400 });
        }

        // Calculate discount amount
        let discountAmount = 0;
        let discountDescription = '';

        switch (discount.type) {
            case 'percentage':
                discountAmount = (subtotal * discount.value) / 100;
                discountDescription = `${discount.value}% off`;
                break;
            case 'fixed':
                discountAmount = Math.min(discount.value, subtotal);
                discountDescription = `$${discount.value.toFixed(2)} off`;
                break;
            case 'free_shipping':
                discountAmount = 0; // Shipping handled separately
                discountDescription = 'Free shipping';
                break;
        }

        return NextResponse.json({
            valid: true,
            code: discount.code,
            type: discount.type,
            value: discount.value,
            discountAmount: discountAmount,
            description: discountDescription,
            freeShipping: discount.type === 'free_shipping',
        });

    } catch (error) {
        console.error('Discount validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate discount code' },
            { status: 500 }
        );
    }
}
