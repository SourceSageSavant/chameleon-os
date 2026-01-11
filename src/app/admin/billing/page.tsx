'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';

interface Plan {
    id: string;
    name: string;
    price_monthly: number;
    max_stores: number;
    max_orders_per_month: number;
    max_ai_calls_per_month: number;
    platform_fee_percent: number;
    features: string[];
}

interface Usage {
    storesCount: number;
    ordersThisMonth: number;
    aiCallsThisMonth: number;
}

export default function BillingPage() {
    const searchParams = useSearchParams();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [usage, setUsage] = useState<Usage>({ storesCount: 0, ordersThisMonth: 0, aiCallsThisMonth: 0 });
    const [currentPlan, setCurrentPlan] = useState('free');
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        // Check for checkout result
        if (searchParams.get('success') === 'true') {
            setNotification({ type: 'success', message: 'Your subscription has been upgraded successfully!' });
            // Clear URL params
            window.history.replaceState({}, '', '/admin/billing');
        } else if (searchParams.get('canceled') === 'true') {
            setNotification({ type: 'error', message: 'Checkout was canceled. No changes were made.' });
            window.history.replaceState({}, '', '/admin/billing');
        }

        loadBillingData();
    }, [searchParams]);


    async function loadBillingData() {
        try {
            const [plansRes, usageRes, subRes] = await Promise.all([
                fetch('/api/billing/plans'),
                fetch('/api/billing/usage'),
                fetch('/api/billing/subscription'),
            ]);

            if (plansRes.ok) {
                const data = await plansRes.json();
                setPlans(data.plans || getDefaultPlans());
            } else {
                setPlans(getDefaultPlans());
            }

            if (usageRes.ok) {
                setUsage(await usageRes.json());
            }

            if (subRes.ok) {
                const sub = await subRes.json();
                setCurrentPlan(sub.plan || 'free');
            }
        } catch (error) {
            console.error('Failed to load billing data:', error);
            setPlans(getDefaultPlans());
        } finally {
            setLoading(false);
        }
    }

    function getDefaultPlans(): Plan[] {
        return [
            { id: 'free', name: 'Free', price_monthly: 0, max_stores: 1, max_orders_per_month: 50, max_ai_calls_per_month: 100, platform_fee_percent: 10, features: ['1 Store', '50 orders/mo', '100 AI calls', '10% platform fee'] },
            { id: 'starter', name: 'Starter', price_monthly: 2900, max_stores: 3, max_orders_per_month: 500, max_ai_calls_per_month: 1000, platform_fee_percent: 7, features: ['3 Stores', '500 orders/mo', '1000 AI calls', '7% platform fee', 'Priority support'] },
            { id: 'pro', name: 'Pro', price_monthly: 7900, max_stores: 10, max_orders_per_month: 2000, max_ai_calls_per_month: 5000, platform_fee_percent: 5, features: ['10 Stores', '2000 orders/mo', '5000 AI calls', '5% platform fee', 'Custom domain'] },
            { id: 'enterprise', name: 'Enterprise', price_monthly: 19900, max_stores: -1, max_orders_per_month: -1, max_ai_calls_per_month: -1, platform_fee_percent: 3, features: ['Unlimited stores', 'Unlimited orders', 'Unlimited AI', '3% platform fee', 'Dedicated support'] },
        ];
    }

    async function handleUpgrade(planId: string) {
        if (planId === 'free' || planId === currentPlan) return;

        setUpgrading(planId);

        try {
            const res = await fetch('/api/billing/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            if (res.ok) {
                const { url } = await res.json();
                if (url) {
                    window.location.href = url;
                }
            } else {
                alert('Failed to create checkout session. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setUpgrading(null);
        }
    }

    function getUsagePercent(used: number, limit: number): number {
        if (limit === -1) return 0;
        return Math.min(100, (used / limit) * 100);
    }

    function formatLimit(limit: number): string {
        return limit === -1 ? '∞' : limit.toLocaleString();
    }

    const activePlan = plans.find(p => p.id === currentPlan) || plans[0];

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-slate-100 rounded mb-8"></div>
                    <div className="h-32 bg-slate-100 rounded-xl mb-6"></div>
                    <div className="h-48 bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Notification Toast */}
            {notification && (
                <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${notification.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className={notification.type === 'success' ? 'text-emerald-800' : 'text-amber-800'}>
                            {notification.message}
                        </span>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-900">Billing & Usage</h1>
                <p className="text-slate-500 mt-1">Manage your subscription and monitor platform usage</p>
            </div>


            {/* Current Plan Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Current Plan</p>
                        <h2 className="text-2xl font-semibold text-slate-900 mt-1">{activePlan?.name || 'Free'}</h2>
                        <span className="inline-flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Active
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-slate-900">
                            ${((activePlan?.price_monthly || 0) / 100).toFixed(0)}
                            <span className="text-base font-normal text-slate-500">/mo</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            {activePlan?.platform_fee_percent}% platform fee
                        </p>
                    </div>
                </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Usage This Month</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stores */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600 font-medium">Stores</span>
                            <span className="text-sm font-semibold text-slate-900">
                                {usage.storesCount} / {formatLimit(activePlan?.max_stores || 1)}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1e3a5f] rounded-full transition-all duration-500"
                                style={{ width: `${getUsagePercent(usage.storesCount, activePlan?.max_stores || 1)}%` }}
                            />
                        </div>
                    </div>

                    {/* Orders */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600 font-medium">Orders</span>
                            <span className="text-sm font-semibold text-slate-900">
                                {usage.ordersThisMonth} / {formatLimit(activePlan?.max_orders_per_month || 50)}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${getUsagePercent(usage.ordersThisMonth, activePlan?.max_orders_per_month || 50)}%` }}
                            />
                        </div>
                    </div>

                    {/* AI Calls */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600 font-medium">AI Calls</span>
                            <span className="text-sm font-semibold text-slate-900">
                                {usage.aiCallsThisMonth} / {formatLimit(activePlan?.max_ai_calls_per_month || 100)}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                style={{ width: `${getUsagePercent(usage.aiCallsThisMonth, activePlan?.max_ai_calls_per_month || 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Plans */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Available Plans</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan) => {
                    const isCurrent = plan.id === currentPlan;
                    const isPopular = plan.id === 'pro';

                    return (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-xl p-6 border-2 transition-all ${isCurrent
                                ? 'border-[#1e3a5f] shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                }`}
                        >
                            {isPopular && (
                                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-[#1e3a5f] text-white rounded mb-3">
                                    Most Popular
                                </span>
                            )}
                            <h4 className="text-xl font-bold text-slate-900">{plan.name}</h4>
                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                ${(plan.price_monthly / 100).toFixed(0)}
                                <span className="text-sm font-normal text-slate-500">/mo</span>
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                                {plan.platform_fee_percent}% platform fee
                            </p>

                            <ul className="space-y-2 text-sm mb-6">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600">
                                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {isCurrent ? (
                                <div className="w-full py-2.5 text-center text-[#1e3a5f] font-semibold">
                                    Current Plan
                                </div>
                            ) : plan.id === 'free' ? (
                                <button
                                    disabled
                                    className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                                >
                                    Free Tier
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={upgrading === plan.id}
                                    className="w-full py-2.5 px-4 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
                                >
                                    {upgrading === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        plan.price_monthly > (activePlan?.price_monthly || 0) ? 'Upgrade' : 'Change Plan'
                                    )}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600">
                    <strong>Need help choosing?</strong> All paid plans include priority support.
                    Enterprise plans include custom integrations and a dedicated success manager.
                    <a href="mailto:support@chameleon.com" className="text-[#1e3a5f] font-medium ml-1 hover:underline">
                        Contact us →
                    </a>
                </p>
            </div>
        </div>
    );
}
