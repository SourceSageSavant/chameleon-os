import { PageLayout } from '@/components/ui';
import { getStoreConfig, generateMetadata } from '@/lib/store-config';

const store = getStoreConfig();

export const metadata = generateMetadata({
    title: 'Privacy Policy',
    description: `How ${store.name} collects, uses, and protects your personal information.`,
    path: '/privacy',
}, store);

export default function PrivacyPage() {
    const store = getStoreConfig();
    const lastUpdated = 'January 10, 2026';

    return (
        <PageLayout
            title="Privacy Policy"
            subtitle={`Last updated: ${lastUpdated}`}
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'Privacy Policy', url: '/privacy' },
            ]}
        >
            <div className="space-y-6 sm:space-y-8 text-sm leading-relaxed opacity-80">
                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Information We Collect
                    </h2>
                    <p className="mb-4">
                        We collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Name, email address, and phone number</li>
                        <li>Billing and shipping address</li>
                        <li>Payment information (processed securely by Stripe)</li>
                        <li>Order history and preferences</li>
                        <li>Communications with our support team</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        How We Use Your Information
                    </h2>
                    <p className="mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and shipping updates</li>
                        <li>Respond to your questions and support requests</li>
                        <li>Send marketing communications (with your consent)</li>
                        <li>Improve our products and services</li>
                        <li>Detect and prevent fraud</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Data Security
                    </h2>
                    <p>
                        We implement industry-standard security measures to protect your personal information.
                        All payment processing is handled by Stripe, a PCI-compliant payment processor.
                        We never store your credit card information on our servers.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Your Rights
                    </h2>
                    <p className="mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access the personal information we hold about you</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Opt out of marketing communications</li>
                        <li>Export your data in a portable format</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Cookies
                    </h2>
                    <p>
                        We use cookies and similar technologies to remember your preferences,
                        analyze site traffic, and personalize your experience. You can manage cookie
                        preferences through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: 'var(--color-text)', opacity: 1 }}>
                        Contact Us
                    </h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us at{' '}
                        <a href={`mailto:${store.supportEmail}`} className="underline">{store.supportEmail}</a>.
                    </p>
                </section>
            </div>
        </PageLayout>
    );
}
