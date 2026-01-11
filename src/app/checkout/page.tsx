'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import { useCartStore } from '@/stores/cart-store';
import { stripePromise } from '@/lib/stripe';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Header, Footer } from '@/components/ui';

interface DiscountInfo {
    code: string;
    type: string;
    value: number;
    discountAmount: number;
    description: string;
    freeShipping: boolean;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal } = useCartStore();
    const [clientSecret, setClientSecret] = useState('');

    // Discount state
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState<DiscountInfo | null>(null);
    const [discountError, setDiscountError] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);

    const subtotal = getSubtotal();
    const discountAmount = discount?.discountAmount || 0;
    const shipping = (subtotal >= 50 || discount?.freeShipping) ? 0 : 5.99;
    const total = subtotal - discountAmount + shipping;

    // Calculate total amount in cents
    const amount = Math.round(total * 100);

    useEffect(() => {
        // Redirect if cart is empty
        if (items.length === 0) {
            router.push('/products');
            return;
        }

        // Create PaymentIntent - send cart items, server calculates price (SECURE)
        const cartItems = items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            variant_id: item.variant_id,
        }));

        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cartItems,
                discount_code: discount?.code,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error('Payment intent error:', data.error);
                    return;
                }
                setClientSecret(data.clientSecret);
            })
            .catch((err) => console.error('Error creating payment intent:', err));
    }, [items, discount, router]);


    async function handleApplyDiscount() {
        if (!discountCode.trim()) return;

        setApplyingDiscount(true);
        setDiscountError('');

        try {
            const response = await fetch('/api/discounts/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode, subtotal }),
            });

            const data = await response.json();

            if (!response.ok) {
                setDiscountError(data.error || 'Invalid discount code');
                setDiscount(null);
            } else {
                setDiscount(data);
                setDiscountError('');
            }
        } catch (err) {
            setDiscountError('Failed to validate discount code');
        }

        setApplyingDiscount(false);
    }

    function handleRemoveDiscount() {
        setDiscount(null);
        setDiscountCode('');
        setDiscountError('');
    }

    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#2D5A27',
            colorBackground: '#ffffff',
            colorText: '#2C3E50',
        },
    };

    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <Header
                logoText="Store"
                trustBadgeText="Secure Checkout • 256-bit Encryption"
                navLinks={[]}
            />

            <main className="section bg-gray-50 min-h-screen">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--color-text)' }}>
                        Checkout
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 order-2 md:order-1">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.images?.[0]}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium text-sm">{item.product.title}</h3>
                                                <p className="font-medium text-sm">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code Input */}
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Code
                                </label>
                                {discount ? (
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                        <div>
                                            <span className="font-mono font-semibold text-green-700">{discount.code}</span>
                                            <span className="text-green-600 text-sm ml-2">({discount.description})</span>
                                        </div>
                                        <button
                                            onClick={handleRemoveDiscount}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                            placeholder="Enter code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase"
                                        />
                                        <button
                                            onClick={handleApplyDiscount}
                                            disabled={applyingDiscount || !discountCode.trim()}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            {applyingDiscount ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {discountError && (
                                    <p className="text-red-500 text-sm mt-2">{discountError}</p>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discount && discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discount.description})</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className={discount?.freeShipping ? 'text-green-600' : ''}>
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Field */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm order-1 md:order-2">
                            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
                            {clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm amount={amount} />
                                </Elements>
                            ) : (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer
                logoText="Store"
                showNewsletter={false}
                description="Secure Payment Processing by Stripe"
            />
        </>
    );
}
