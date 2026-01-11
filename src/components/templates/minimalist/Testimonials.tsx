'use client';

interface Testimonial {
    quote: string;
    author: string;
    role?: string;
}

interface MinimalistTestimonialsProps {
    title?: string;
    testimonials?: Testimonial[];
}

export function MinimalistTestimonials({
    title = 'What Our Clients Say',
    testimonials = [
        {
            quote: 'The attention to detail is extraordinary. This is exactly what I was looking for—elegant, functional, and built to last.',
            author: 'Alexandra Chen',
            role: 'Designer',
        },
        {
            quote: 'I appreciate brands that don\'t compromise. Every aspect of this product reflects a commitment to excellence.',
            author: 'Marcus Webb',
            role: 'Architect',
        },
        {
            quote: 'Simple, refined, perfect. It\'s rare to find something that meets such high standards.',
            author: 'Isabella Romano',
            role: 'Art Director',
        },
    ],
}: MinimalistTestimonialsProps) {
    return (
        <section className="py-32 bg-neutral-900 text-white">
            <div className="container mx-auto px-6 lg:px-16">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="font-serif text-4xl lg:text-5xl font-light">
                        {title}
                    </h2>
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="relative">
                            {/* Quote mark */}
                            <span className="text-6xl font-serif text-neutral-700 absolute -top-4 -left-2">
                                "
                            </span>

                            <blockquote className="relative pt-8">
                                <p className="text-lg text-neutral-300 leading-relaxed mb-8">
                                    {testimonial.quote}
                                </p>

                                <footer>
                                    <p className="font-medium text-white">{testimonial.author}</p>
                                    {testimonial.role && (
                                        <p className="text-sm text-neutral-500">{testimonial.role}</p>
                                    )}
                                </footer>
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MinimalistTestimonials;
