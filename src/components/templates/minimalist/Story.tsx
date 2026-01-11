'use client';

interface MinimalistStoryProps {
    title?: string;
    subtitle?: string;
    paragraphs?: string[];
    image?: string;
    imageAlt?: string;
}

export function MinimalistStory({
    title = 'Our Story',
    subtitle = 'A Legacy of Craftsmanship',
    paragraphs = [
        'Every piece we create is a testament to the art of patience. We believe that true quality cannot be rushed—it must be cultivated.',
        'Founded on the principle that less is more, we have spent years perfecting our craft, eliminating the unnecessary until only the essential remains.',
        'Each material is carefully sourced, each detail meticulously considered. The result is a product that transcends trends and stands the test of time.',
    ],
    image = '/story-image.jpg',
    imageAlt = 'Craftsmanship',
}: MinimalistStoryProps) {
    return (
        <section className="py-32 bg-neutral-50">
            <div className="container mx-auto px-6 lg:px-16">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-[4/5] bg-neutral-200 overflow-hidden">
                            <img
                                src={image}
                                alt={imageAlt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative line */}
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-neutral-300" />
                    </div>

                    {/* Content */}
                    <div className="lg:max-w-lg">
                        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-4">
                            {subtitle}
                        </p>

                        <h2 className="font-serif text-4xl lg:text-5xl font-light text-neutral-900 mb-10">
                            {title}
                        </h2>

                        <div className="space-y-6">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-neutral-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Signature */}
                        <div className="mt-12 pt-8 border-t border-neutral-200">
                            <p className="font-serif text-lg italic text-neutral-700">
                                "Quality is remembered long after price is forgotten."
                            </p>
                            <p className="text-sm text-neutral-400 mt-2">— Our Founding Principle</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MinimalistStory;
