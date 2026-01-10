import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Header, CartDrawer, Footer } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';

export const metadata = {
    title: 'Shop All Products',
    description: 'Browse our collection of NSF Certified supplements.',
};

// Fetch products server-side
async function getProducts() {
    const supabase = createBrowserClient();

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return products || [];
}

export default async function ProductsPage() {
    const products = await getProducts();

    // Smart redirect: If only 1 product, go directly to product detail
    if (products.length === 1) {
        redirect(`/products/${products[0].slug}`);
    }

    // If no products, show empty state
    if (products.length === 0) {
        return (
            <>
                <Header
                    logoText="CreatinePro"
                    trustBadgeText="NSF Certified for Sport • Free Shipping Over $50"
                    navLinks={[
                        { label: 'Shop', href: '/products' },
                        { label: 'Benefits', href: '/#benefits' },
                        { label: 'Certifications', href: '/#trust' },
                        { label: 'FAQ', href: '/#faq' },
                    ]}
                />
                <CartDrawer />
                <main className="section min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                            Coming Soon
                        </h1>
                        <p className="opacity-70" style={{ color: 'var(--color-text)' }}>
                            Our products are being prepared. Check back soon!
                        </p>
                    </div>
                </main>
                <Footer
                    logoText="CreatinePro"
                    description="Premium creatine gummies backed by science. NSF Certified for Sport."
                    copyrightText="© 2026 CreatinePro. All rights reserved."
                />
            </>
        );
    }

    // Multiple products: Show grid
    return (
        <>
            <Header
                logoText="CreatinePro"
                trustBadgeText="NSF Certified for Sport • Free Shipping Over $50"
                navLinks={[
                    { label: 'Shop', href: '/products' },
                    { label: 'Benefits', href: '/#benefits' },
                    { label: 'Certifications', href: '/#trust' },
                    { label: 'FAQ', href: '/#faq' },
                ]}
            />
            <CartDrawer />

            <main className="section">
                <div className="container">
                    {/* Page header */}
                    <div className="text-center mb-12">
                        <h1
                            className="text-3xl md:text-4xl font-bold mb-4"
                            style={{ color: 'var(--color-text)' }}
                        >
                            Shop All Products
                        </h1>
                        <p
                            className="text-lg opacity-70 max-w-xl mx-auto"
                            style={{ color: 'var(--color-text)' }}
                        >
                            NSF Certified supplements trusted by athletes worldwide.
                        </p>
                    </div>

                    {/* Products grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group"
                            >
                                <div className="card overflow-hidden">
                                    {/* Product image */}
                                    <div
                                        className="aspect-square relative overflow-hidden"
                                        style={{ background: 'var(--color-background)' }}
                                    >
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <svg
                                                        className="w-16 h-16 mx-auto opacity-20"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        style={{ color: 'var(--color-text)' }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-xs opacity-40 mt-2">Product Image</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sale badge */}
                                        {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                                            <div
                                                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                                                style={{ background: 'var(--color-error, #EF4444)' }}
                                            >
                                                Save ${(Number(product.compare_at_price) - Number(product.price)).toFixed(0)}
                                            </div>
                                        )}

                                        {/* View Product overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="btn btn-primary text-sm py-3 px-6">
                                                View Product
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product info */}
                                    <div className="p-5">
                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {product.badges?.slice(0, 2).map((badge: string, i: number) => (
                                                <span key={i} className="trust-badge text-xs py-1 px-2">
                                                    {badge}
                                                </span>
                                            ))}
                                            {(!product.badges || product.badges.length === 0) && (
                                                <span className="trust-badge text-xs py-1 px-2">
                                                    NSF Certified
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="font-semibold text-lg mb-2 group-hover:opacity-80 transition-opacity"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            {product.title}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-xl font-bold"
                                                style={{ color: 'var(--color-primary)' }}
                                            >
                                                ${Number(product.price).toFixed(2)}
                                            </span>
                                            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                                                <span
                                                    className="text-sm line-through opacity-50"
                                                    style={{ color: 'var(--color-text)' }}
                                                >
                                                    ${Number(product.compare_at_price).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer
                logoText="CreatinePro"
                description="Premium creatine gummies backed by science. NSF Certified for Sport."
                copyrightText="© 2026 CreatinePro. All rights reserved."
            />
        </>
    );
}
