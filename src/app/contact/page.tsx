'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/ui';
import { getStoreConfig } from '@/lib/store-config';

export default function ContactPage() {
    const store = getStoreConfig();

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Replace with actual form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1000);
    };

    return (
        <PageLayout
            title="Contact Us"
            subtitle="We'd love to hear from you"
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'Contact', url: '/contact' },
            ]}
        >
            <div className="space-y-8">
                {submitted ? (
                    <div
                        className="text-center p-6 sm:p-8 rounded-2xl"
                        style={{ background: 'var(--color-background)' }}
                    >
                        <div className="text-4xl sm:text-5xl mb-4">✅</div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                            Message Sent!
                        </h2>
                        <p className="opacity-70 text-sm sm:text-base">
                            We'll get back to you within 24 hours.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2"
                                    style={{
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        background: 'white',
                                    }}
                                    placeholder="John Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2"
                                    style={{
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        background: 'white',
                                    }}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                Subject
                            </label>
                            <select
                                value={formState.subject}
                                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: 'rgba(0,0,0,0.1)',
                                    background: 'white',
                                }}
                            >
                                <option value="">Select a topic...</option>
                                <option value="order">Order Question</option>
                                <option value="product">Product Question</option>
                                <option value="shipping">Shipping & Delivery</option>
                                <option value="returns">Returns & Refunds</option>
                                <option value="wholesale">Wholesale Inquiries</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                Message
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 resize-none"
                                style={{
                                    borderColor: 'rgba(0,0,0,0.1)',
                                    background: 'white',
                                }}
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full btn btn-primary py-3 sm:py-4 ${isSubmitting ? 'opacity-70' : ''}`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}

                {/* Contact info */}
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl mb-2">📧</div>
                        <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Email</h3>
                        <a href={`mailto:${store.supportEmail}`} className="text-xs sm:text-sm opacity-70 hover:opacity-100">
                            {store.supportEmail}
                        </a>
                    </div>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl mb-2">💬</div>
                        <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Live Chat</h3>
                        <p className="text-xs sm:text-sm opacity-70">Mon-Fri, 9am-5pm EST</p>
                    </div>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl mb-2">⏰</div>
                        <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Response Time</h3>
                        <p className="text-xs sm:text-sm opacity-70">Within 24 hours</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
