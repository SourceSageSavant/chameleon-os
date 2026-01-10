import { PageLayout } from '@/components/ui';
import { getStoreConfig, generateMetadata } from '@/lib/store-config';

const store = getStoreConfig();

export const metadata = generateMetadata({
    title: 'About Us',
    description: `Learn about ${store.name} and our commitment to quality, transparency, and customer satisfaction.`,
    path: '/about',
}, store);

export default function AboutPage() {
    const store = getStoreConfig();

    return (
        <PageLayout
            title="About Us"
            subtitle={`Our commitment to quality and transparency`}
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' },
            ]}
        >
            <div className="space-y-8">
                {/* Story */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Our Story
                    </h2>
                    <p className="opacity-80 leading-relaxed mb-4 text-sm sm:text-base">
                        At {store.name}, we believe that quality should never be compromised. We started with a simple mission:
                        to create products that actually work, backed by science and verified by third-party testing.
                    </p>
                    <p className="opacity-80 leading-relaxed text-sm sm:text-base">
                        Every product we make goes through rigorous testing to ensure it meets our high standards.
                        We're transparent about what's in our products because we have nothing to hide.
                    </p>
                </section>

                {/* Values */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Our Values
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 text-sm sm:text-base">🔬 Transparency</h3>
                            <p className="text-xs sm:text-sm opacity-70">Third-party tested. We publish our lab results.</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 text-sm sm:text-base">💪 Efficacy</h3>
                            <p className="text-xs sm:text-sm opacity-70">Products that work. No fairy-dusting or fillers.</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 text-sm sm:text-base">🏆 Quality</h3>
                            <p className="text-xs sm:text-sm opacity-70">Premium ingredients. Made in certified facilities.</p>
                        </div>
                    </div>
                </section>

                {/* Commitment */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Quality Commitment
                    </h2>
                    <p className="opacity-80 leading-relaxed text-sm sm:text-base">
                        All our products are manufactured in GMP-certified, FDA-registered facilities.
                        We use only premium ingredients and every batch is tested for purity and potency.
                    </p>
                </section>

                {/* CTA */}
                <section className="text-center pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <p className="opacity-70 mb-4 text-sm sm:text-base">Have questions?</p>
                    <a href="/contact" className="btn btn-primary">
                        Contact Us
                    </a>
                </section>
            </div>
        </PageLayout>
    );
}
