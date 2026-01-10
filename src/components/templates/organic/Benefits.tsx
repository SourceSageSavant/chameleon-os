'use client';

interface Benefit {
    icon: 'shield' | 'lightning' | 'heart' | 'check' | 'star' | 'beaker';
    title: string;
    description: string;
}

interface OrganicBenefitsProps {
    title?: string;
    subtitle?: string;
    benefits?: Benefit[];
}

const icons = {
    shield: (
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    ),
    lightning: (
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    ),
    heart: (
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    ),
    check: (
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    ),
    star: (
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    ),
    beaker: (
        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
    ),
};

export function OrganicBenefits({
    title = 'Why Athletes Choose Us',
    subtitle = 'Backed by science. Trusted by professionals. Made for you.',
    benefits = [
        {
            icon: 'shield',
            title: 'NSF Certified for Sport',
            description: 'Every batch is third-party tested and certified for banned substance safety. Trusted by Olympic athletes.',
        },
        {
            icon: 'lightning',
            title: '2.5g Per Gummy',
            description: 'The highest potency gummy on the market. Get your full 5g daily dose in just 2 delicious gummies.',
        },
        {
            icon: 'beaker',
            title: 'Creapure® Creatine',
            description: 'Made with premium German-engineered creatine monohydrate for maximum absorption and results.',
        },
        {
            icon: 'check',
            title: 'No Fillers or Junk',
            description: 'Zero artificial colors, zero maltodextrin, zero proprietary blends. Just pure, effective ingredients.',
        },
        {
            icon: 'heart',
            title: 'Easy on Your Stomach',
            description: 'Unlike powders that cause bloating, our gummy formula is gentle and easy to digest.',
        },
        {
            icon: 'star',
            title: 'Made in the USA',
            description: 'Manufactured in an FDA-registered, GMP-certified facility in Georgia, USA.',
        },
    ],
}: OrganicBenefitsProps) {
    return (
        <section id="benefits" className="section" style={{ background: 'white' }}>
            <div className="container">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-lg opacity-70"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Benefits grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                            style={{
                                background: 'var(--color-background)',
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: 'rgba(45, 90, 39, 0.1)' }}
                            >
                                <svg
                                    className="w-7 h-7"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    {icons[benefit.icon]}
                                </svg>
                            </div>

                            {/* Title */}
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p
                                className="opacity-70 leading-relaxed"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Comparison section */}
                <div className="mt-16 p-8 rounded-2xl" style={{ background: 'var(--color-background)' }}>
                    <h3
                        className="text-2xl font-bold text-center mb-8"
                        style={{ color: 'var(--color-text)' }}
                    >
                        How We Compare
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--color-text)' }}>Feature</th>
                                    <th className="text-center p-4 font-semibold" style={{ color: 'var(--color-primary)', background: 'rgba(45, 90, 39, 0.1)', borderRadius: '0.5rem 0.5rem 0 0' }}>Our Gummies</th>
                                    <th className="text-center p-4 font-semibold opacity-60" style={{ color: 'var(--color-text)' }}>Competitor A</th>
                                    <th className="text-center p-4 font-semibold opacity-60" style={{ color: 'var(--color-text)' }}>Competitor B</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Creatine per Gummy', '2.5g', '1g', '1.5g'],
                                    ['Gummies for Full Dose', '2', '5', '4'],
                                    ['NSF Certified', '✓', '✓', '✗'],
                                    ['Made in USA', '✓', '✗', '✓'],
                                    ['Price per Serving', '$1.16', '$1.66', '$1.33'],
                                ].map((row, index) => (
                                    <tr key={index} className="border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                                        <td className="p-4 font-medium" style={{ color: 'var(--color-text)' }}>{row[0]}</td>
                                        <td className="text-center p-4 font-bold" style={{ color: 'var(--color-primary)', background: 'rgba(45, 90, 39, 0.05)' }}>{row[1]}</td>
                                        <td className="text-center p-4 opacity-60" style={{ color: 'var(--color-text)' }}>{row[2]}</td>
                                        <td className="text-center p-4 opacity-60" style={{ color: 'var(--color-text)' }}>{row[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrganicBenefits;
