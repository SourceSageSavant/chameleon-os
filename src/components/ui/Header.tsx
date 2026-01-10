'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';

interface HeaderProps {
    logoText?: string;
    logoUrl?: string;
    navLinks?: { label: string; href: string }[];
    showTrustBadge?: boolean;
    trustBadgeText?: string;
}

export function Header({
    logoText = 'Chameleon',
    logoUrl,
    navLinks = [
        { label: 'Shop', href: '/products' },
        { label: 'Benefits', href: '/#benefits' },
        { label: 'About', href: '/about' },
        { label: 'FAQ', href: '/#faq' },
    ],
    showTrustBadge = true,
    trustBadgeText = 'NSF Certified for Sport',
}: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get cart state
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, []);

    return (
        <>
            {/* Trust badge bar */}
            {showTrustBadge && (
                <div
                    className="py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium text-white"
                    style={{ background: 'var(--color-primary)' }}
                >
                    <div className="container flex items-center justify-center gap-1.5 sm:gap-2">
                        <svg
                            className="shrink-0"
                            style={{ width: '14px', height: '14px' }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">{trustBadgeText}</span>
                        <span className="sm:hidden">NSF Certified • Free Shipping $50+</span>
                    </div>
                </div>
            )}

            {/* Main header */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'shadow-md backdrop-blur-lg bg-white/90'
                    : 'bg-white'
                    }`}
            >
                <div className="container">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            {logoUrl ? (
                                <img src={logoUrl} alt={logoText} className="h-8 md:h-10" />
                            ) : (
                                <span
                                    className="text-xl md:text-2xl font-bold"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    {logoText}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium transition-colors hover:opacity-70"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center gap-4">
                            {/* Cart button */}
                            <button
                                onClick={toggleCart}
                                className="relative p-2 rounded-full transition-colors hover:bg-black/5"
                                aria-label="Open cart"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                {itemCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full"
                                        style={{ background: 'var(--color-primary)' }}
                                    >
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>

                            {/* CTA Button (Desktop) */}
                            <Link
                                href="/products"
                                className="hidden md:inline-flex btn btn-primary text-sm px-6 py-2.5"
                            >
                                Shop Now
                            </Link>

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/5"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <nav className="container py-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-black/5"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/products"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn btn-primary mt-2 text-center"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default Header;
