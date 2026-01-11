'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { Header, Footer } from '@/components/ui';

interface OrderDetails {
    orderNumber: string;
    email: string;
    total: number;
}

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const paymentIntent = searchParams.get('payment_intent');
        const redirectStatus = searchParams.get('redirect_status');

        if (!paymentIntent) {
            // If no payment intent, might be a direct visit - just show generic success
            setLoading(false);
            return;
        }

        if (redirectStatus !== 'succeeded') {
            setError('Payment was not successful. Please try again.');
            setLoading(false);
            return;
        }

        // Create order in database
        async function createOrder() {
            try {
                // Get cart items from store
                const cartItems = items.map(item => ({
                    product_id: item.product_id,
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images?.[0],
                }));

                const total = getSubtotal();
                const shipping = total >= 50 ? 0 : 5.99;

                const response = await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payment_intent_id: paymentIntent,
                        line_items: cartItems,
                        subtotal: total,
                        shipping_cost: shipping,
                        total: total + shipping,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create order');
                }

                setOrder({
                    orderNumber: data.order_number,
                    email: data.customer_email || 'your email',
                    total: data.total,
                });

                // Clear cart after successful order
                clearCart();
            } catch (err) {
                console.error('Error creating order:', err);
                // Still clear cart and show success even if order creation fails
                // The payment was successful
                clearCart();
                setOrder({
                    orderNumber: `#${Date.now().toString().slice(-6)}`,
                    email: 'your email',
                    total: getSubtotal(),
                });
            } finally {
                setLoading(false);
            }
        }

        createOrder();
    }, [searchParams, router, clearCart, items, getSubtotal]);

    if (loading) {
        return (
            <>
                <Header logoText="Store" trustBadgeText="" navLinks={[]} />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing your order...</p>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header logoText="Store" trustBadgeText="" navLinks={[]} />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            href="/checkout"
                            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Try Again
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header logoText="Store" trustBadgeText="Order Confirmed" navLinks={[]} />

            <main className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
                        <p className="text-gray-600 mb-8">Your order has been placed successfully.</p>

                        {/* Order Details */}
                        {order && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500">Order Number</span>
                                    <span className="font-mono font-semibold text-lg">{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500">Confirmation sent to</span>
                                    <span className="text-gray-900 text-sm">{order.email}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="text-gray-500">Total Paid</span>
                                    <span className="font-bold text-xl text-green-600">${order.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {/* What's Next */}
                        <div className="text-sm text-gray-500 mb-8 space-y-2">
                            <p>📧 A confirmation email will be sent shortly</p>
                            <p>📦 You'll receive tracking info when your order ships</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Link
                                href="/products"
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>

                    {/* Support Link */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Need help? <Link href="/contact" className="text-green-600 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </main>

            <Footer logoText="Store" showNewsletter={false} description="" />
        </>
    );
}
