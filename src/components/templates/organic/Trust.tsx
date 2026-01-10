'use client';

interface TrustBadge {
    name: string;
    description: string;
    icon: 'shield' | 'check' | 'beaker' | 'flag';
}

interface OrganicTrustProps {
    title?: string;
    subtitle?: string;
    badges?: TrustBadge[];
    verificationText?: string;
}

const icons = {
    shield: (
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    ),
    check: (
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    ),
    beaker: (
        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
    ),
    flag: (
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
    ),
};

export function OrganicTrust({
    title = 'Verified Purity',
    subtitle = 'In a market full of "0g creatine" scandals, we prove what\'s in every bottle.',
    badges = [
        {
            name: 'NSF Certified for Sport',
            description: 'Independently tested for over 270+ banned substances. Trusted by Olympic athletes.',
            icon: 'shield',
        },
        {
            name: 'ISO 17025 Accredited',
            description: 'Our lab testing meets the highest international standards for accuracy.',
            icon: 'beaker',
        },
        {
            name: 'GMP Certified Facility',
            description: 'Manufactured in an FDA-registered facility following strict standards.',
            icon: 'check',
        },
        {
            name: 'Made in USA',
            description: 'Produced in our Georgia facility with domestic ingredients.',
            icon: 'flag',
        },
    ],
    verificationText = 'Every batch includes a QR code linking to its Certificate of Analysis.',
}: OrganicTrustProps) {
    return (
        <section id="trust" className="section" style={{ background: 'var(--color-background)' }}>
            <div className="container">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
                        style={{ background: 'rgba(45, 90, 39, 0.1)' }}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-primary)' }}>
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-primary)' }}>Third-Party Verified</span>
                    </div>

                    <h2
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-sm sm:text-base lg:text-lg opacity-70"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Trust badges grid */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className="p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
                            style={{
                                background: 'white',
                                borderColor: 'rgba(45, 90, 39, 0.2)'
                            }}
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'var(--color-primary)' }}
                                >
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        {icons[badge.icon]}
                                    </svg>
                                </div>

                                <div>
                                    {/* Name */}
                                    <h3
                                        className="text-base sm:text-lg font-semibold mb-1"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {badge.name}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className="text-xs sm:text-sm opacity-70 leading-relaxed"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Verification callout */}
                <div
                    className="mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 rounded-xl lg:rounded-2xl max-w-2xl mx-auto text-center"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary), rgba(45, 90, 39, 0.8))',
                    }}
                >
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <p className="text-white font-medium text-sm sm:text-base lg:text-lg">
                            {verificationText}
                        </p>
                    </div>
                </div>

                {/* Scale test teaser */}
                <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
                    <p
                        className="text-base sm:text-lg font-medium mb-3 sm:mb-4"
                        style={{ color: 'var(--color-text)' }}
                    >
                        Don&apos;t just take our word for it
                    </p>
                    <button
                        className="btn btn-secondary inline-flex items-center gap-2"
                        onClick={() => {/* TODO: Link to TikTok or video */ }}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Watch Our Scale Test Challenge</span>
                        <span className="sm:hidden">Watch Scale Test</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default OrganicTrust;
