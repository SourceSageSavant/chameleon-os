import { NextResponse } from 'next/server';
import { getUserUsage } from '@/lib/usage-tracker';

// GET /api/billing/usage - Get current user's usage stats
export async function GET() {
    try {
        // In production, get userId from auth session
        // For now, use a placeholder
        const userId = 'current-user'; // TODO: Get from auth

        const usage = await getUserUsage(userId);

        return NextResponse.json({
            storesCount: usage.storesCount,
            ordersThisMonth: usage.ordersThisMonth,
            aiCallsThisMonth: usage.aiCallsThisMonth,
        });
    } catch (error) {
        console.error('Usage API error:', error);
        return NextResponse.json({
            storesCount: 0,
            ordersThisMonth: 0,
            aiCallsThisMonth: 0,
        });
    }
}
