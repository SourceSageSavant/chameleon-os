import { PageLayout } from '@/components/ui';
import { getStoreConfig, generateMetadata } from '@/lib/store-config';

const store = getStoreConfig();

export const metadata = generateMetadata({
    title: 'Shipping Information',
    description: `Free shipping on orders over $${store.shippingThreshold}. Fast, reliable delivery.`,
    path: '/shipping',
}, store);

export default function ShippingPage() {
    const store = getStoreConfig();

    return (
        <PageLayout
            title="Shipping Information"
            subtitle={`Free shipping on orders over $${store.shippingThreshold}`}
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'Shipping', url: '/shipping' },
            ]}
        >
            <div className="space-y-6 sm:space-y-8">
                {/* Shipping options */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Shipping Options
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                        <div
                            className="p-4 sm:p-5 rounded-xl border-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                            style={{ borderColor: 'var(--color-primary)', background: 'var(--color-background)' }}
                        >
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Standard Shipping</h3>
                                <p className="text-xs sm:text-sm opacity-70">3-5 business days</p>
                            </div>
                            <div className="sm:text-right">
                                <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--color-primary)' }}>FREE</span>
                                <p className="text-xs opacity-50">Orders over ${store.shippingThreshold}</p>
                            </div>
                        </div>
                        <div
                            className="p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                            style={{ borderColor: 'rgba(0,0,0,0.1)', background: 'var(--color-background)' }}
                        >
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Standard Shipping</h3>
                                <p className="text-xs sm:text-sm opacity-70">3-5 business days</p>
                            </div>
                            <div className="sm:text-right">
                                <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>$5.99</span>
                                <p className="text-xs opacity-50">Orders under ${store.shippingThreshold}</p>
                            </div>
                        </div>
                        <div
                            className="p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                            style={{ borderColor: 'rgba(0,0,0,0.1)', background: 'var(--color-background)' }}
                        >
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Express Shipping</h3>
                                <p className="text-xs sm:text-sm opacity-70">1-2 business days</p>
                            </div>
                            <div className="sm:text-right">
                                <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>$12.99</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delivery info */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Delivery Information
                    </h2>
                    <div className="space-y-3 sm:space-y-4 opacity-80 text-sm sm:text-base">
                        <p>
                            <strong>Processing Time:</strong> Orders are typically processed within 1-2 business days.
                            You'll receive a confirmation email with tracking information once your order ships.
                        </p>
                        <p>
                            <strong>Carriers:</strong> We ship via USPS, UPS, and FedEx depending on your location.
                        </p>
                        <p>
                            <strong>P.O. Boxes:</strong> We can ship to P.O. boxes via USPS for standard shipping only.
                        </p>
                    </div>
                </section>

                {/* International */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        International Shipping
                    </h2>
                    <div
                        className="p-4 sm:p-5 rounded-xl"
                        style={{ background: 'var(--color-background)' }}
                    >
                        <p className="opacity-80 text-sm sm:text-base">
                            We currently ship to the United States only. International shipping is coming soon!
                            Sign up for our newsletter to be notified.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <p className="opacity-70 mb-4 text-sm sm:text-base">Have questions about your order?</p>
                    <a href="/contact" className="btn btn-secondary">
                        Contact Support
                    </a>
                </section>
            </div>
        </PageLayout>
    );
}
