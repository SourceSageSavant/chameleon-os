'use client';

interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
    verified: boolean;
}

interface OrganicTestimonialsProps {
    title?: string;
    subtitle?: string;
    testimonials?: Testimonial[];
}

export function OrganicTestimonials({
    title = 'What Athletes Are Saying',
    subtitle = 'Join thousands of athletes who trust us for their training',
    testimonials = [
        {
            name: 'Marcus T.',
            role: 'CrossFit Athlete',
            content: "Finally, a creatine I actually want to take! No more choking down powder. These gummies taste great and I've noticed real improvements in my lifts.",
            rating: 5,
            verified: true,
        },
        {
            name: 'Sarah K.',
            role: 'Olympic Weightlifter',
            content: 'As an Olympic athlete, NSF certification is non-negotiable. These are the ONLY gummies I trust. The convenience is unmatched.',
            rating: 5,
            verified: true,
        },
        {
            name: 'James R.',
            role: 'Personal Trainer',
            content: 'I recommend these to all my clients. The potency is real - 2.5g per gummy is insane compared to competitors. Worth every penny.',
            rating: 5,
            verified: true,
        },
        {
            name: 'Emily W.',
            role: 'Marathon Runner',
            content: "I was skeptical about gummies, but the results speak for themselves. Better recovery, more energy, and they don't upset my stomach like powders did.",
            rating: 5,
            verified: true,
        },
        {
            name: 'Daniel M.',
            role: 'College Football Player',
            content: "Our entire team switched to these. The coach loves that they're NSF certified, and we love that they taste like candy but actually work.",
            rating: 5,
            verified: true,
        },
        {
            name: 'Ashley P.',
            role: 'Fitness Influencer',
            content: "I've tried every creatine on the market. These are hands-down the best. No bloating, no loading phase needed, just results.",
            rating: 5,
            verified: true,
        },
    ],
}: OrganicTestimonialsProps) {
    return (
        <section id="testimonials" className="section" style={{ background: 'var(--color-background)' }}>
            <div className="container">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
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

                {/* Testimonials grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl transition-all duration-300 hover:shadow-lg"
                            style={{ background: 'white' }}
                        >
                            {/* Stars */}
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                        style={{ color: i < testimonial.rating ? '#FBBF24' : '#E5E7EB' }}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p
                                className="text-sm sm:text-base leading-relaxed mb-4"
                                style={{ color: 'var(--color-text)' }}
                            >
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className="font-semibold text-sm sm:text-base"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {testimonial.name}
                                    </p>
                                    <p
                                        className="text-xs sm:text-sm opacity-60"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {testimonial.role}
                                    </p>
                                </div>
                                {testimonial.verified && (
                                    <span
                                        className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                        style={{
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            color: '#22C55E'
                                        }}
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            style={{ width: '12px', height: '12px' }}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-8 sm:mt-10 lg:mt-12 py-6 sm:py-8 border-t border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
                        <div>
                            <p
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                2,400+
                            </p>
                            <p className="text-xs sm:text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
                                5-Star Reviews
                            </p>
                        </div>
                        <div>
                            <p
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                4.9
                            </p>
                            <p className="text-xs sm:text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
                                Average Rating
                            </p>
                        </div>
                        <div>
                            <p
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                50k+
                            </p>
                            <p className="text-xs sm:text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
                                Athletes Trust Us
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrganicTestimonials;
