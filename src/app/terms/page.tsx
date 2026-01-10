import { PageLayout } from '@/components/ui';
import { getStoreConfig, generateMetadata } from '@/lib/store-config';

const store = getStoreConfig();

export const metadata = generateMetadata({
    title: 'Terms of Service',
    description: `Terms and conditions for using ${store.name} products and services.`,
    path: '/terms',
}, store);

export default function TermsPage() {
    const store = getStoreConfig();
    const lastUpdated = 'January 10, 2026';

    return (
        <PageLayout
            title="Terms of Service"
            subtitle={`Last updated: ${lastUpdated}`}
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'Terms of Service', url: '/terms' },
            ]}
        >
            <div className="space-y-6 sm:space-y-8 text-sm leading-relaxed opacity-80">
                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Acceptance of Terms
                    </h2>
                    <p>
                        By accessing or using the {store.name} website and purchasing our products,
                        you agree to be bound by these Terms of Service. If you do not agree to these terms,
                        please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Products and Orders
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All products are subject to availability</li>
                        <li>We reserve the right to limit quantities</li>
                        <li>Prices are subject to change without notice</li>
                        <li>We reserve the right to refuse any order</li>
                        <li>Orders are not confirmed until payment is processed</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Shipping and Delivery
                    </h2>
                    <p>
                        Shipping times are estimates and not guarantees. We are not responsible for delays
                        caused by carriers, weather, or other circumstances beyond our control.
                        Risk of loss transfers to you upon delivery to the carrier.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Returns and Refunds
                    </h2>
                    <p>
                        Please see our <a href="/returns" className="underline">Returns Policy</a> for
                        detailed information about returns, exchanges, and refunds.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Product Use Disclaimer
                    </h2>
                    <p className="mb-4">
                        {store.productCategory === 'Health & Wellness' ? (
                            <>
                                Our products are dietary supplements and are not intended to diagnose, treat,
                                cure, or prevent any disease. Consult your healthcare provider before starting
                                any supplement regimen, especially if you:
                            </>
                        ) : (
                            <>
                                Our products are sold as-is. Please read all product documentation before use.
                                If you have concerns about product suitability, please:
                            </>
                        )}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Are pregnant or nursing</li>
                        <li>Have a medical condition</li>
                        <li>Are taking prescription medications</li>
                        <li>Are under 18 years of age</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Intellectual Property
                    </h2>
                    <p>
                        All content on this website, including text, graphics, logos, and images,
                        is the property of {store.name} and is protected by copyright and trademark laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Limitation of Liability
                    </h2>
                    <p>
                        To the maximum extent permitted by law, {store.name} shall not be liable for
                        any indirect, incidental, special, consequential, or punitive damages arising
                        from your use of our products or services.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Contact
                    </h2>
                    <p>
                        Questions about these Terms? Contact us at{' '}
                        <a href={`mailto:${store.supportEmail}`} className="underline">{store.supportEmail}</a>.
                    </p>
                </section>
            </div>
        </PageLayout>
    );
}
