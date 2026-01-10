import { ReactNode } from 'react';
import { Header, CartDrawer, Footer } from '@/components/ui';
import { getStoreConfig } from '@/lib/store-config';
import { JsonLd, generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface PageLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    breadcrumb?: { name: string; url: string }[];
}

export function PageLayout({ children, title, subtitle, breadcrumb }: PageLayoutProps) {
    const store = getStoreConfig();

    // Build breadcrumb if not provided
    const defaultBreadcrumb = [
        { name: 'Home', url: '/' },
        { name: title, url: '#' },
    ];

    return (
        <>
            {/* Structured Data */}
            <JsonLd data={generateOrganizationSchema(store)} />
            <JsonLd data={generateBreadcrumbSchema(breadcrumb || defaultBreadcrumb, store)} />

            <Header
                logoText={store.name}
                trustBadgeText={`NSF Certified for Sport • Free Shipping Over $${store.shippingThreshold}`}
                navLinks={[
                    { label: 'Shop', href: '/products' },
                    { label: 'Benefits', href: '/#benefits' },
                    { label: 'Certifications', href: '/#trust' },
                    { label: 'FAQ', href: '/#faq' },
                ]}
            />
            <CartDrawer />

            <main className="section">
                <div className="container max-w-3xl">
                    {/* Page header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p
                                className="text-sm sm:text-base lg:text-lg opacity-70"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Page content */}
                    <div
                        className="prose prose-lg max-w-none"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {children}
                    </div>
                </div>
            </main>

            <Footer
                logoText={store.name}
                description={store.description}
                copyrightText={`© ${new Date().getFullYear()} ${store.name}. All rights reserved.`}
                socialLinks={[
                    ...(store.social.instagram ? [{ platform: 'instagram' as const, href: store.social.instagram }] : []),
                    ...(store.social.tiktok ? [{ platform: 'tiktok' as const, href: store.social.tiktok }] : []),
                    ...(store.social.twitter ? [{ platform: 'twitter' as const, href: store.social.twitter }] : []),
                ]}
            />
        </>
    );
}

export default PageLayout;
