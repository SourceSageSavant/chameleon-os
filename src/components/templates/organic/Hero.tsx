'use client';

interface OrganicHeroProps {
    productName?: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
    badges?: string[];
    ctaText?: string;
    ctaLink?: string;
}

export function OrganicHero({
    productName = 'Premium Creatine Gummies',
    tagline = 'The Only Gummy with 2.5g Per Serving',
    description = 'NSF Certified for Sport. No more handfuls of pills or chalky powders. Just 2 gummies for your full daily dose.',
    heroImage = '/product-hero.png',
    badges = ['NSF Certified', 'Made in USA', '2.5g Per Gummy'],
    ctaText = 'Shop Now',
    ctaLink = '/products',
}: OrganicHeroProps) {
    return (
        <section className="section relative overflow-hidden" style={{ background: 'var(--color-background)' }}>
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, var(--color-accent) 0%, transparent 50%)`,
                }}
            />

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Content */}
                    <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-fadeIn order-2 lg:order-1">
                        {/* Trust badges - scrollable on mobile */}
                        <div className="flex flex-wrap gap-2">
                            {badges.map((badge, index) => (
                                <span
                                    key={index}
                                    className="trust-badge"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {badge}
                                </span>
                            ))}
                        </div>

                        {/* Main heading - Responsive text */}
                        <h1
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {productName}
                        </h1>

                        {/* Tagline */}
                        <p
                            className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {tagline}
                        </p>

                        {/* Description */}
                        <p
                            className="text-sm sm:text-base lg:text-lg opacity-80"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {description}
                        </p>

                        {/* Comparison callout */}
                        <div
                            className="p-3 sm:p-4 rounded-xl border-2"
                            style={{
                                borderColor: 'var(--color-primary)',
                                background: 'rgba(45, 90, 39, 0.05)'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shrink-0"
                                    style={{ background: 'var(--color-primary)' }}
                                >
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>
                                        Only 2 Gummies = Full Dose
                                    </p>
                                    <p className="text-xs sm:text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                                        Competitors require 5+ gummies daily
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <a
                                href={ctaLink}
                                className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 justify-center"
                            >
                                {ctaText}
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a
                                href="#benefits"
                                className="btn btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 justify-center"
                            >
                                Learn More
                            </a>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-3 sm:gap-4 pt-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-600"
                                        style={{ zIndex: 10 - i }}
                                    />
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                                    2,400+ Athletes Trust Us
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Image */}
                    <div className="relative animate-fadeIn order-1 lg:order-2" style={{ animationDelay: '0.3s' }}>
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 blur-3xl opacity-20 rounded-full hidden lg:block"
                            style={{ background: 'var(--color-primary)' }}
                        />

                        {/* Product image container */}
                        <div className="relative aspect-square max-w-xs sm:max-w-sm lg:max-w-none mx-auto">
                            <img
                                src={heroImage}
                                alt={productName}
                                className="w-full h-full object-contain drop-shadow-2xl animate-float"
                            />

                            {/* Price badge - Hidden on very small screens */}
                            <div
                                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-sm sm:text-base text-white shadow-lg"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                $34.99
                            </div>

                            {/* NSF badge - Smaller on mobile */}
                            <div
                                className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                                style={{
                                    background: 'white',
                                    color: 'var(--color-primary)'
                                }}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="hidden sm:inline">NSF Certified for Sport</span>
                                <span className="sm:hidden">NSF Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrganicHero;
