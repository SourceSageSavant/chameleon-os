import { createClient } from '@supabase/supabase-js';

// =============================================================================
// USAGE TRACKER - Logs platform usage for billing and analytics
// =============================================================================

type EventType =
    | 'store_created'
    | 'order_processed'
    | 'ai_call'
    | 'page_view'
    | 'product_created'
    | 'email_sent';

interface UsageEvent {
    userId?: string;
    storeId?: string;
    eventType: EventType;
    metadata?: Record<string, unknown>;
}

// Server-side Supabase client
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

/**
 * Log a usage event
 */
export async function logUsage(event: UsageEvent): Promise<void> {
    try {
        const supabase = getSupabase();

        await supabase.from('usage_logs').insert({
            user_id: event.userId || null,
            store_id: event.storeId || null,
            event_type: event.eventType,
            metadata: event.metadata || {},
        });
    } catch (error) {
        // Don't throw - usage logging should never break the main flow
        console.error('Usage logging error:', error);
    }
}

/**
 * Get usage stats for a user in the current billing period
 */
export async function getUserUsage(userId: string): Promise<{
    storesCount: number;
    ordersThisMonth: number;
    aiCallsThisMonth: number;
}> {
    const supabase = getSupabase();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get store count
    const { count: storesCount } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    // Get orders this month
    const { count: ordersThisMonth } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('event_type', 'order_processed')
        .gte('created_at', startOfMonth.toISOString());

    // Get AI calls this month
    const { count: aiCallsThisMonth } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('event_type', 'ai_call')
        .gte('created_at', startOfMonth.toISOString());

    return {
        storesCount: storesCount || 0,
        ordersThisMonth: ordersThisMonth || 0,
        aiCallsThisMonth: aiCallsThisMonth || 0,
    };
}

/**
 * Check if user is within their plan limits
 */
export async function checkPlanLimits(userId: string): Promise<{
    withinLimits: boolean;
    limits: {
        maxStores: number;
        maxOrders: number;
        maxAiCalls: number;
    };
    usage: {
        stores: number;
        orders: number;
        aiCalls: number;
    };
}> {
    const supabase = getSupabase();

    // Get user's subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('max_stores, max_orders_per_month, max_ai_calls_per_month')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    // Default to free plan limits
    const limits = {
        maxStores: subscription?.max_stores || 1,
        maxOrders: subscription?.max_orders_per_month || 50,
        maxAiCalls: subscription?.max_ai_calls_per_month || 100,
    };

    const usage = await getUserUsage(userId);

    // -1 means unlimited
    const withinLimits =
        (limits.maxStores === -1 || usage.storesCount < limits.maxStores) &&
        (limits.maxOrders === -1 || usage.ordersThisMonth < limits.maxOrders) &&
        (limits.maxAiCalls === -1 || usage.aiCallsThisMonth < limits.maxAiCalls);

    return {
        withinLimits,
        limits,
        usage: {
            stores: usage.storesCount,
            orders: usage.ordersThisMonth,
            aiCalls: usage.aiCallsThisMonth,
        },
    };
}

// Convenience methods for common events
export const trackStoreCreated = (userId: string, storeId: string) =>
    logUsage({ userId, storeId, eventType: 'store_created' });

export const trackOrderProcessed = (userId: string, storeId: string, orderId: string, amount: number) =>
    logUsage({ userId, storeId, eventType: 'order_processed', metadata: { orderId, amount } });

export const trackAiCall = (userId: string, storeId: string, callType: string) =>
    logUsage({ userId, storeId, eventType: 'ai_call', metadata: { callType } });

export const trackProductCreated = (userId: string, storeId: string, productId: string) =>
    logUsage({ userId, storeId, eventType: 'product_created', metadata: { productId } });
