'use client';

interface Feature {
    title: string;
    description: string;
    icon?: string;
}

interface MinimalistFeaturesProps {
    title?: string;
    subtitle?: string;
    features?: Feature[];
}

export function MinimalistFeatures({
    title = 'Designed with Purpose',
    subtitle = 'Features',
    features = [
        {
            title: 'Premium Materials',
            description: 'Sourced from the finest suppliers, each component meets our exacting standards for quality and durability.',
        },
        {
            title: 'Precision Engineering',
            description: 'Every detail is considered, every measurement exact. The result of countless hours of refinement.',
        },
        {
            title: 'Timeless Design',
            description: 'We design for longevity, not trends. A product that remains relevant for years to come.',
        },
        {
            title: 'Lifetime Guarantee',
            description: 'We stand behind our work. If something goes wrong, we will make it right—no questions asked.',
        },
    ],
}: MinimalistFeaturesProps) {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6 lg:px-16">
                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-4">
                        {subtitle}
                    </p>
                    <h2 className="font-serif text-4xl lg:text-5xl font-light text-neutral-900">
                        {title}
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-16 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="relative">
                            {/* Number */}
                            <span className="text-8xl font-serif text-neutral-100 absolute -top-8 -left-4">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <div className="relative">
                                <h3 className="text-xl font-medium text-neutral-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MinimalistFeatures;
