-- =============================================================================
-- PHASE 4: SAAS BILLING SCHEMA
-- =============================================================================
-- Run this in Supabase SQL Editor to enable SaaS features
-- =============================================================================

-- Add Stripe Connect fields to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS payouts_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS platform_fee_percent DECIMAL(5,2) DEFAULT 5.00;

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event_type TEXT NOT NULL, -- 'store_created', 'order_processed', 'ai_call', 'page_view'
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient usage queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_event_type ON usage_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'starter', 'pro', 'enterprise'
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing'
    
    -- Plan limits
    max_stores INTEGER DEFAULT 1,
    max_orders_per_month INTEGER DEFAULT 50,
    max_ai_calls_per_month INTEGER DEFAULT 100,
    
    -- Billing info
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- Plan definitions (reference table)
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY, -- 'free', 'starter', 'pro', 'enterprise'
    name TEXT NOT NULL,
    price_monthly INTEGER NOT NULL, -- in cents
    price_yearly INTEGER NOT NULL, -- in cents
    max_stores INTEGER NOT NULL,
    max_orders_per_month INTEGER NOT NULL,
    max_ai_calls_per_month INTEGER NOT NULL,
    platform_fee_percent DECIMAL(5,2) NOT NULL,
    features JSONB DEFAULT '[]'
);

-- Insert default plans
INSERT INTO plans (id, name, price_monthly, price_yearly, max_stores, max_orders_per_month, max_ai_calls_per_month, platform_fee_percent, features) VALUES
('free', 'Free', 0, 0, 1, 50, 100, 10.00, '["1 Store", "50 orders/mo", "100 AI calls", "10% platform fee"]'),
('starter', 'Starter', 2900, 29000, 3, 500, 1000, 7.00, '["3 Stores", "500 orders/mo", "1000 AI calls", "7% platform fee", "Priority support"]'),
('pro', 'Pro', 7900, 79000, 10, 2000, 5000, 5.00, '["10 Stores", "2000 orders/mo", "5000 AI calls", "5% platform fee", "Priority support", "Custom domain"]'),
('enterprise', 'Enterprise', 19900, 199000, -1, -1, -1, 3.00, '["Unlimited stores", "Unlimited orders", "Unlimited AI", "3% platform fee", "Dedicated support", "Custom integrations"]')
ON CONFLICT (id) DO NOTHING;

-- Function to get user's usage for current billing period
CREATE OR REPLACE FUNCTION get_user_usage(p_user_id UUID)
RETURNS TABLE (
    stores_count BIGINT,
    orders_this_month BIGINT,
    ai_calls_this_month BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM stores WHERE user_id = p_user_id)::BIGINT,
        (SELECT COUNT(*) FROM usage_logs 
         WHERE user_id = p_user_id 
         AND event_type = 'order_processed'
         AND created_at >= date_trunc('month', NOW()))::BIGINT,
        (SELECT COUNT(*) FROM usage_logs 
         WHERE user_id = p_user_id 
         AND event_type = 'ai_call'
         AND created_at >= date_trunc('month', NOW()))::BIGINT;
END;
$$ LANGUAGE plpgsql;
