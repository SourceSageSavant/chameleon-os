'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import { Header, Footer } from '@/components/ui';

export default function CustomerLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createBrowserClient();

        if (mode === 'register') {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            // Auto-login after registration
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError('Account created! Please check your email to verify.');
                setLoading(false);
                return;
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }
        }

        router.push('/account');
    }

    return (
        <>
            <Header logoText="Store" trustBadgeText="" navLinks={[{ label: 'Shop', href: '/products' }]} />

            <main className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-md mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        {/* Tabs */}
                        <div className="flex mb-8 border-b">
                            <button
                                onClick={() => setMode('login')}
                                className={`flex-1 pb-3 text-center font-medium ${mode === 'login'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-500'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('register')}
                                className={`flex-1 pb-3 text-center font-medium ${mode === 'register'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-500'
                                    }`}
                            >
                                Create Account
                            </button>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-500 text-center mb-8">
                            {mode === 'login'
                                ? 'Sign in to view your orders and account'
                                : 'Create an account for faster checkout'}
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'register' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {loading
                                    ? 'Please wait...'
                                    : mode === 'login'
                                        ? 'Sign In'
                                        : 'Create Account'}
                            </button>
                        </form>

                        {mode === 'login' && (
                            <p className="text-center text-sm text-gray-500 mt-6">
                                <Link href="/account/forgot-password" className="text-green-600 hover:underline">
                                    Forgot your password?
                                </Link>
                            </p>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        <Link href="/" className="text-green-600 hover:underline">
                            ← Back to Store
                        </Link>
                    </p>
                </div>
            </main>

            <Footer logoText="Store" showNewsletter={false} description="" />
        </>
    );
}
