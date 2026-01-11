import { Metadata } from 'next';
import Link from 'next/link';
import { getTopCities, US_CITIES } from '@/lib/cities';

export const metadata: Metadata = {
    title: 'All Locations | Free Shipping Nationwide',
    description: 'We ship to all cities across the United States. Find your city and enjoy free shipping on orders over $50.',
};

export default function LocationsPage() {
    const cities = getTopCities(100);

    // Group by state
    const byState: Record<string, typeof cities> = {};
    cities.forEach(city => {
        if (!byState[city.state]) {
            byState[city.state] = [];
        }
        byState[city.state].push(city);
    });

    const states = Object.keys(byState).sort();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="py-16 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">We Ship Everywhere</h1>
                    <p className="text-xl opacity-90">
                        Free shipping to {US_CITIES.length}+ cities across the United States
                    </p>
                </div>
            </section>

            {/* Cities by State */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {states.map(state => (
                            <div key={state} className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                                    {state}
                                </h2>
                                <ul className="space-y-2">
                                    {byState[state].slice(0, 8).map(city => (
                                        <li key={city.slug}>
                                            <Link
                                                href={`/locations/${city.slug}`}
                                                className="text-gray-600 hover:text-[#1e3a5f] hover:underline"
                                            >
                                                {city.name}
                                            </Link>
                                        </li>
                                    ))}
                                    {byState[state].length > 8 && (
                                        <li className="text-sm text-gray-400">
                                            + {byState[state].length - 8} more
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 px-4 bg-white text-center">
                <p className="text-gray-600 mb-4">Don't see your city? We still ship there!</p>
                <Link
                    href="/products"
                    className="inline-block px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#2d4a6f]"
                >
                    Shop Now
                </Link>
            </section>
        </div>
    );
}
