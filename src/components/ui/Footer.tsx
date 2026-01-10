'use client';

import Link from 'next/link';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface FooterProps {
    logoText?: string;
    description?: string;
    sections?: FooterSection[];
    showNewsletter?: boolean;
    newsletterTitle?: string;
    copyrightText?: string;
    socialLinks?: { platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'youtube'; href: string }[];
}

const socialIcons = {
    instagram: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    ),
    tiktok: (
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    ),
    twitter: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
    facebook: (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
    youtube: (
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
};

export function Footer({
    logoText = 'Chameleon',
    description = 'Premium supplements backed by science, trusted by athletes.',
    sections = [
        {
            title: 'Shop',
            links: [
                { label: 'All Products', href: '/products' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/about' },
                { label: 'Lab Results', href: '/lab-results' },
                { label: 'Certifications', href: '/#trust' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'FAQ', href: '/#faq' },
                { label: 'Shipping', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Contact', href: '/contact' },
            ],
        },
    ],
    showNewsletter = true,
    newsletterTitle = 'Get 10% Off Your First Order',
    copyrightText = '© 2026 All rights reserved.',
    socialLinks = [
        { platform: 'instagram', href: '#' },
        { platform: 'tiktok', href: '#' },
        { platform: 'twitter', href: '#' },
    ],
}: FooterProps) {
    return (
        <footer style={{ background: 'var(--color-text)', color: 'white' }}>
            {/* Main footer content */}
            <div className="container py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-white">
                            {logoText}
                        </Link>
                        <p className="mt-4 text-sm opacity-70 max-w-xs leading-relaxed">
                            {description}
                        </p>

                        {/* Social links */}
                        <div className="flex gap-4 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                                    aria-label={social.platform}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        {socialIcons[social.platform]}
                                    </svg>
                                </a>
                            ))}
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10">
                                🛡️ NSF Certified
                            </span>
                            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10">
                                🇺🇸 Made in USA
                            </span>
                            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10">
                                🔬 Lab Tested
                            </span>
                        </div>
                    </div>

                    {/* Link sections */}
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/60">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/80 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                {showNewsletter && (
                    <div
                        className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl sm:rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                            <div className="text-center lg:text-left">
                                <h3 className="text-base sm:text-lg font-semibold">{newsletterTitle}</h3>
                                <p className="text-xs sm:text-sm opacity-70 mt-1">
                                    Join 10,000+ athletes getting weekly tips and exclusive offers.
                                </p>
                            </div>
                            <form className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full lg:w-auto" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full sm:flex-1 lg:w-64 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20 placeholder:text-white/50 focus:outline-none focus:border-white/40"
                                />
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 shrink-0"
                                    style={{ background: 'var(--color-primary)', color: 'white' }}
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="container py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                        <p className="text-white/50">{copyrightText}</p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/returns" className="text-white/60 hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
