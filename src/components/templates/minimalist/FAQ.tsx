'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface MinimalistFAQProps {
    title?: string;
    faqs?: FAQItem[];
}

export function MinimalistFAQ({
    title = 'Frequently Asked Questions',
    faqs = [
        {
            question: 'What materials do you use?',
            answer: 'We source only the finest materials from trusted suppliers around the world. Each component is selected for its quality, durability, and aesthetic properties.',
        },
        {
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery. All orders include tracking.',
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for all unused items in original packaging. Returns are free of charge within the continental US.',
        },
        {
            question: 'Do you offer a warranty?',
            answer: 'Yes, all our products come with a 2-year warranty covering manufacturing defects. We believe in the longevity of our products.',
        },
    ],
}: MinimalistFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6 lg:px-16">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl lg:text-5xl font-light text-neutral-900">
                            {title}
                        </h2>
                    </div>

                    {/* FAQs */}
                    <div className="divide-y divide-neutral-200">
                        {faqs.map((faq, index) => (
                            <div key={index} className="py-6">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <span className="text-lg font-medium text-neutral-900 pr-8">
                                        {faq.question}
                                    </span>
                                    <span className="text-2xl text-neutral-400 flex-shrink-0">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 pt-4' : 'max-h-0'
                                    }`}>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MinimalistFAQ;
