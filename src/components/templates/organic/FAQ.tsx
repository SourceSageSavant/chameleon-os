'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface OrganicFAQProps {
    title?: string;
    subtitle?: string;
    items?: FAQItem[];
}

export function OrganicFAQ({
    title = 'Frequently Asked Questions',
    subtitle = 'Everything you need to know about our creatine gummies.',
    items = [
        {
            question: 'How many gummies do I take per day?',
            answer: 'Take just 2 gummies daily to get your full 5g dose of creatine. We recommend taking them after your workout or with a meal for optimal absorption.',
        },
        {
            question: 'What makes your gummies different?',
            answer: 'Three key differences: 1) Potency - 2.5g per gummy, highest on market. 2) Purity - Creapure® German creatine, NSF Certified. 3) No junk - zero artificial colors or fillers.',
        },
        {
            question: 'Are these safe for athletes?',
            answer: 'Yes! NSF Certified for Sport means every batch is tested for 270+ banned substances. Trusted by Olympic athletes and pros worldwide.',
        },
        {
            question: 'Do I need a loading phase?',
            answer: 'No loading phase required. Just take 2 gummies daily consistently. Research shows 5g daily effectively builds muscle creatine stores over time.',
        },
        {
            question: 'Will creatine make me bloated?',
            answer: 'Our gummy formula is designed to be gentle on digestion. Unlike powders, creatine is evenly distributed and absorbed gradually. Most customers report no issues.',
        },
        {
            question: 'How long until I see results?',
            answer: 'Most notice increased performance within 2-4 weeks. Full muscle saturation typically occurs within 4-6 weeks with consistent use.',
        },
    ],
}: OrganicFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="section" style={{ background: 'white' }}>
            <div className="container max-w-3xl">
                {/* Section header */}
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
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

                {/* FAQ items */}
                <div className="space-y-3 sm:space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl lg:rounded-2xl overflow-hidden transition-all"
                            style={{
                                background: 'var(--color-background)',
                                border: openIndex === index ? '2px solid var(--color-primary)' : '2px solid transparent'
                            }}
                        >
                            {/* Question button */}
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 lg:p-6 text-left gap-3"
                            >
                                <span
                                    className="font-semibold text-sm sm:text-base lg:text-lg"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {item.question}
                                </span>
                                <span
                                    className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    style={{
                                        background: openIndex === index ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                                        color: openIndex === index ? 'white' : 'var(--color-text)'
                                    }}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            {/* Answer */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div
                                    className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 text-sm sm:text-base leading-relaxed"
                                    style={{ color: 'var(--color-text)', opacity: 0.8 }}
                                >
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
                    <p
                        className="text-base sm:text-lg mb-3 sm:mb-4"
                        style={{ color: 'var(--color-text)' }}
                    >
                        Still have questions?
                    </p>
                    <a
                        href="/contact"
                        className="btn btn-secondary"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </section>
    );
}

export default OrganicFAQ;
