import { PageLayout } from '@/components/ui';
import { getStoreConfig, generateMetadata } from '@/lib/store-config';

const store = getStoreConfig();

export const metadata = generateMetadata({
    title: 'Returns & Refunds',
    description: `${store.returnDays}-day money-back guarantee. Easy returns, no questions asked.`,
    path: '/returns',
}, store);

export default function ReturnsPage() {
    const store = getStoreConfig();

    return (
        <PageLayout
            title="Returns & Refunds"
            subtitle={`${store.returnDays}-day money-back guarantee`}
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'Returns', url: '/returns' },
            ]}
        >
            <div className="space-y-6 sm:space-y-8">
                {/* Guarantee */}
                <section
                    className="p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center"
                    style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                    <div className="text-3xl sm:text-4xl mb-3">🛡️</div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">100% Satisfaction Guarantee</h2>
                    <p className="opacity-90 text-sm sm:text-base">
                        If you're not completely satisfied, we'll refund your money. No questions asked.
                    </p>
                </section>

                {/* Policy */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Return Policy
                    </h2>
                    <div className="space-y-3 sm:space-y-4 opacity-80 text-sm sm:text-base">
                        <p>
                            We want you to be completely happy with your purchase. If for any reason you're not satisfied,
                            you can return your product within <strong>{store.returnDays} days</strong> of delivery for a full refund.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Returns accepted within {store.returnDays} days of delivery</li>
                            <li>Products can be opened (we get it, you need to try them!)</li>
                            <li>Refunds processed within 5-7 business days</li>
                            <li>Original shipping costs are non-refundable</li>
                        </ul>
                    </div>
                </section>

                {/* How to return */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        How to Request a Return
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--color-background)' }}>
                            <div className="text-xl sm:text-2xl mb-2">1️⃣</div>
                            <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Contact Us</h3>
                            <p className="text-xs sm:text-sm opacity-70">Email us with your order number</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--color-background)' }}>
                            <div className="text-xl sm:text-2xl mb-2">2️⃣</div>
                            <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Get Label</h3>
                            <p className="text-xs sm:text-sm opacity-70">We'll send a prepaid return label</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--color-background)' }}>
                            <div className="text-xl sm:text-2xl mb-2">3️⃣</div>
                            <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Get Refund</h3>
                            <p className="text-xs sm:text-sm opacity-70">Refund within 5-7 days of receipt</p>
                        </div>
                    </div>
                </section>

                {/* Damaged items */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Damaged or Defective Products
                    </h2>
                    <div
                        className="p-4 sm:p-5 rounded-xl"
                        style={{ background: 'var(--color-background)' }}
                    >
                        <p className="opacity-80 text-sm sm:text-base">
                            If your order arrives damaged or defective, contact us within 7 days.
                            We'll send a replacement at no additional cost. Please include photos of the damage.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <p className="opacity-70 mb-4 text-sm sm:text-base">Need to start a return?</p>
                    <a href="/contact" className="btn btn-primary">
                        Contact Support
                    </a>
                </section>
            </div>
        </PageLayout>
    );
}
