'use client';

interface Spec {
    label: string;
    value: string;
    icon?: string;
}

interface CyberSpecsProps {
    title?: string;
    subtitle?: string;
    specs?: Spec[];
}

export function CyberSpecs({
    title = 'TECH SPECS',
    subtitle = 'Built Different',
    specs = [
        { label: 'Response Time', value: '0.5ms' },
        { label: 'Refresh Rate', value: '120Hz' },
        { label: 'Battery Life', value: '80hrs' },
        { label: 'Connectivity', value: '2.4GHz' },
        { label: 'Weight', value: '285g' },
        { label: 'RGB Zones', value: '16.8M' },
    ],
}: CyberSpecsProps) {
    return (
        <section className="py-24 bg-gray-950 relative overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                }} />
            </div>

            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-cyan-400 text-sm uppercase tracking-widest mb-2">
                        {subtitle}
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-black text-white">
                        {title}
                    </h2>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                    {specs.map((spec, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative p-6 border border-white/10 bg-white/5 text-center hover:border-cyan-500/50 transition-colors">
                                <p className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {spec.value}
                                </p>
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    {spec.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CyberSpecs;
