'use client';

interface MinimalistHeroProps {
    productName?: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
    ctaText?: string;
    ctaLink?: string;
    price?: string;
    comparePrice?: string;
}

export function MinimalistHero({
    productName = 'The Essential Watch',
    tagline = 'Timeless Design',
    description = 'Crafted with precision and purpose. A statement of understated elegance for those who appreciate the finer details.',
    heroImage = '/product-hero.png',
    ctaText = 'Shop Now',
    ctaLink = '/products',
    price = '$299',
    comparePrice = '$399',
}: MinimalistHeroProps) {
    return (
        <section className="min-h-screen bg-white flex items-center">
            <div className="container mx-auto px-6 lg:px-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-6">
                            {tagline}
                        </p>

                        <h1 className="font-serif text-5xl lg:text-7xl font-light text-neutral-900 mb-8 leading-[1.1]">
                            {productName}
                        </h1>

                        <p className="text-lg text-neutral-600 leading-relaxed mb-10 max-w-md">
                            {description}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 mb-10">
                            <span className="text-3xl font-light text-neutral-900">{price}</span>
                            {comparePrice && (
                                <span className="text-xl text-neutral-400 line-through">{comparePrice}</span>
                            )}
                        </div>

                        {/* CTA */}
                        <a
                            href={ctaLink}
                            className="inline-block px-12 py-4 bg-neutral-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                        >
                            {ctaText}
                        </a>

                        {/* Trust Line */}
                        <p className="text-sm text-neutral-400 mt-8">
                            Free shipping · 30-day returns · 2-year warranty
                        </p>
                    </div>

                    {/* Image */}
                    <div className="order-1 lg:order-2">
                        <div className="relative aspect-square bg-neutral-50">
                            <img
                                src={heroImage}
                                alt={productName}
                                className="w-full h-full object-contain p-8"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MinimalistHero;
