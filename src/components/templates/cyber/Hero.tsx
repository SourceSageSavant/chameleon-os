'use client';

interface CyberHeroProps {
    productName?: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
    badges?: string[];
    ctaText?: string;
    ctaLink?: string;
    price?: string;
    comparePrice?: string;
}

export function CyberHero({
    productName = 'NEXUS PRO X',
    tagline = 'NEXT-GEN PERFORMANCE',
    description = 'Engineered for those who demand more. Cutting-edge technology meets uncompromising design.',
    heroImage = '/product-hero.png',
    badges = ['RGB SYNC', '120Hz', 'WIRELESS'],
    ctaText = 'Pre-Order Now',
    ctaLink = '/products',
    price = '$199.99',
    comparePrice = '$249.99',
}: CyberHeroProps) {
    return (
        <section className="min-h-screen bg-black relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl" />

            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                <div className="min-h-screen flex items-center">
                    <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20">
                        {/* Text Content */}
                        <div>
                            {/* Tag */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/30 rounded-full mb-8">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                <span className="text-xs uppercase tracking-widest text-cyan-400">
                                    {tagline}
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                                {productName.split(' ').map((word, i) => (
                                    <span key={i} className={i === productName.split(' ').length - 1 ? 'text-cyan-400' : ''}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-lg text-gray-400 mb-8 max-w-md leading-relaxed">
                                {description}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-10">
                                {badges.map((badge, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded text-sm text-white font-medium"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-bold text-white">{price}</span>
                                {comparePrice && (
                                    <span className="text-xl text-gray-500 line-through">{comparePrice}</span>
                                )}
                            </div>

                            {/* CTA */}
                            <a
                                href={ctaLink}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold uppercase tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105"
                            >
                                {ctaText}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Image */}
                        <div className="relative">
                            <div className="relative aspect-square">
                                {/* Glow ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse" />
                                <div className="absolute inset-4 rounded-full border border-cyan-500/20" />

                                <img
                                    src={heroImage}
                                    alt={productName}
                                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_50px_rgba(6,182,212,0.3)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CyberHero;
