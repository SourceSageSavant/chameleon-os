'use client';

interface Feature {
    title: string;
    description: string;
    icon?: string;
}

interface CyberFeaturesProps {
    title?: string;
    features?: Feature[];
}

export function CyberFeatures({
    title = 'FEATURES',
    features = [
        {
            title: 'Zero Latency',
            description: 'Ultra-fast response with our proprietary wireless technology. No lag, no compromise.',
        },
        {
            title: 'Precision Sensors',
            description: 'Military-grade tracking accuracy. Every movement captured with surgical precision.',
        },
        {
            title: 'RGB Ecosystem',
            description: 'Sync with your entire setup. 16.8 million colors, infinite possibilities.',
        },
        {
            title: 'Endurance Mode',
            description: '80+ hours of gameplay on a single charge. Outlast every opponent.',
        },
    ],
}: CyberFeaturesProps) {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6 lg:px-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-white">
                        {title}
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="relative p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-cyan-500/50 transition-all group"
                        >
                            {/* Number */}
                            <span className="absolute top-4 right-4 text-5xl font-black text-white/5 group-hover:text-cyan-500/10 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <div className="relative">
                                {/* Icon placeholder */}
                                <div className="w-12 h-12 bg-cyan-500/20 rounded flex items-center justify-center mb-6">
                                    <div className="w-6 h-6 bg-cyan-400 rounded-sm" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
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

export default CyberFeatures;
