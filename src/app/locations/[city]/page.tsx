import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getTopCities, US_CITIES as allCities } from '@/lib/cities';
import { createServerClient } from '@/lib/supabase';

interface CityPageProps {
    params: { city: string };
}

export async function generateStaticParams() {
    return allCities.slice(0, 50).map((city) => ({
        city: city.slug,
    }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const city = getCityBySlug(params.city);

    if (!city) {
        return { title: 'Not Found' };
    }

    return {
        title: `Premium Products in ${city.name}, ${city.state} | Free Shipping`,
        description: `Shop premium quality products with free shipping to ${city.name}, ${city.state}. Fast delivery, trusted by ${city.population?.toLocaleString() || 'thousands'} of customers.`,
    };
}

export default async function CityPage({ params }: CityPageProps) {
    const city = getCityBySlug(params.city);

    if (!city) {
        notFound();
    }

    // Get featured products from the active store
    const supabase = createServerClient();
    const { data: store } = await supabase
        .from('stores')
        .select('id, name, primary_color, theme')
        .eq('is_active', true)
        .limit(1)
        .single();

    let products: any[] = [];
    if (store) {
        const { data } = await supabase
            .from('products')
            .select('id, title, slug, price, images')
            .eq('store_id', store.id)
            .eq('is_active', true)
            .limit(6);
        products = data || [];
    }

    // Get nearby cities for internal linking
    const nearbyCities = getTopCities(100)
        .filter(c => c.state === city.state && c.slug !== city.slug)
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section
                className="py-20 px-4"
                style={{ background: store?.primary_color ? `linear-gradient(135deg, ${store.primary_color} 0%, ${store.primary_color}dd 100%)` : 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%)' }}
            >
                <div className="max-w-6xl mx-auto text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Premium Products in {city.name}, {city.state}
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                        Free shipping on all orders • Trusted by customers across {city.state}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/products"
                            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Local Benefits */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why {city.name} Customers Choose Us
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-xl font-semibold mb-2">Fast Delivery to {city.name}</h3>
                            <p className="text-gray-600">
                                Get your order shipped directly to your {city.name} address with our express shipping options.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="text-xl font-semibold mb-2">Trusted Quality</h3>
                            <p className="text-gray-600">
                                Join {(city.population || 100000) > 500000 ? 'thousands' : 'hundreds'} of happy customers in {city.state} who trust our products.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-semibold mb-2">Best Prices Guaranteed</h3>
                            <p className="text-gray-600">
                                Competitive pricing with free shipping on orders over $50 to {city.name}.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {products.length > 0 && (
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Popular Products in {city.name}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {product.images?.[0] && (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900">{product.title}</h3>
                                        <p className="text-lg font-bold text-green-600">${product.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                href="/products"
                                className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
                            >
                                View All Products
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Local SEO Content */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto prose prose-lg">
                    <h2>Serving {city.name}, {city.state} and Beyond</h2>
                    <p>
                        We're proud to serve customers in {city.name} and throughout {city.state}.
                        With a population of over {city.population?.toLocaleString() || 'many'} residents,
                        {city.name} is one of the most vibrant cities in the region.
                    </p>
                    <p>
                        Whether you're located in downtown {city.name} or the surrounding suburbs,
                        our fast and reliable shipping ensures your order arrives quickly and safely.
                        We've built a reputation for quality products and exceptional customer service
                        that {city.name} residents have come to trust.
                    </p>
                    <h3>Local Delivery Options</h3>
                    <ul>
                        <li>Standard shipping: 5-7 business days to {city.name}</li>
                        <li>Express shipping: 2-3 business days to {city.name}</li>
                        <li>Priority shipping: 1-2 business days to {city.name}</li>
                    </ul>
                </div>
            </section>

            {/* Nearby Cities - Internal Linking */}
            {nearbyCities.length > 0 && (
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Also Serving Nearby Cities
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {nearbyCities.map((nearbyCity) => (
                                <Link
                                    key={nearbyCity.slug}
                                    href={`/locations/${nearbyCity.slug}`}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 transition-colors"
                                >
                                    {nearbyCity.name}, {nearbyCity.state}
                                </Link>
                            ))}
                            <Link
                                href="/locations"
                                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                View All Locations →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-900 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Order in {city.name}?
                </h2>
                <p className="text-lg opacity-80 mb-8">
                    Free shipping on all orders over $50
                </p>
                <Link
                    href="/products"
                    className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100"
                >
                    Start Shopping
                </Link>
            </section>
        </div>
    );
}
