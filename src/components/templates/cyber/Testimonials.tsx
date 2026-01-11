'use client';

interface Testimonial {
    quote: string;
    author: string;
    handle?: string;
    avatar?: string;
}

interface CyberTestimonialsProps {
    title?: string;
    testimonials?: Testimonial[];
}

export function CyberTestimonials({
    title = 'THE COMMUNITY',
    testimonials = [
        {
            quote: 'This thing is absolutely insane. The response time is unreal — it feels like the game is reading my mind.',
            author: 'xNightmare',
            handle: '@nightmare_ttv',
        },
        {
            quote: 'Finally, a brand that understands what competitive gamers actually need. No gimmicks, just performance.',
            author: 'ProdigyAce',
            handle: '@prodigy_esports',
        },
        {
            quote: 'The build quality is next level. Been using it for 6 months straight, still feels brand new.',
            author: 'TechReviewPro',
            handle: '@techreviewpro',
        },
    ],
}: CyberTestimonialsProps) {
    return (
        <section className="py-24 bg-gray-950">
            <div className="container mx-auto px-6 lg:px-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-white">
                        {title}
                    </h2>
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="p-6 border border-white/10 bg-white/5 hover:border-cyan-500/30 transition-colors"
                        >
                            {/* Quote */}
                            <p className="text-gray-300 leading-relaxed mb-6">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-sm">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{testimonial.author}</p>
                                    {testimonial.handle && (
                                        <p className="text-sm text-cyan-400">{testimonial.handle}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CyberTestimonials;
