'use client';

interface CyberCTAProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    features?: string[];
}

export function CyberCTA({
    title = 'READY TO DOMINATE?',
    subtitle = 'Join thousands of elite gamers',
    ctaText = 'Get Yours Now',
    ctaLink = '/products',
    features = ['Free Shipping', '30-Day Returns', '2-Year Warranty'],
}: CyberCTAProps) {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/30 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Title */}
                    <h2 className="text-4xl lg:text-6xl font-black text-white mb-4">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        {subtitle}
                    </p>

                    {/* CTA Button */}
                    <a
                        href={ctaLink}
                        className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg uppercase tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
                    >
                        {ctaText}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CyberCTA;
