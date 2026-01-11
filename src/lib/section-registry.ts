'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// =============================================================================
// SECTION REGISTRY - Maps JSON section types to React components
// =============================================================================
// This enables JSON-driven page layouts without code changes.
// To add a new section: 1) Create component, 2) Add to registry below
// =============================================================================

export interface SectionProps {
    id?: string;
    productName?: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
    price?: string;
    comparePrice?: string;
    features?: string[];
    benefits?: Array<{ title: string; description: string; icon?: string }>;
    testimonials?: Array<{ name: string; text: string; rating?: number }>;
    faqItems?: Array<{ question: string; answer: string }>;
    trustBadges?: string[];
    ctaText?: string;
    ctaLink?: string;
    [key: string]: unknown; // Allow any additional props
}

// Lazy-loaded components for code splitting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sectionComponents: Record<string, any> = {

    // Organic Theme Sections
    'organic_hero': dynamic(() => import('@/components/templates/organic').then(m => m.OrganicHero)),
    'organic_benefits': dynamic(() => import('@/components/templates/organic').then(m => m.OrganicBenefits)),
    'organic_trust': dynamic(() => import('@/components/templates/organic').then(m => m.OrganicTrust)),
    'organic_testimonials': dynamic(() => import('@/components/templates/organic').then(m => m.OrganicTestimonials)),
    'organic_faq': dynamic(() => import('@/components/templates/organic').then(m => m.OrganicFAQ)),

    // Minimalist Theme Sections
    'minimalist_hero': dynamic(() => import('@/components/templates/minimalist').then(m => m.MinimalistHero)),
    'minimalist_story': dynamic(() => import('@/components/templates/minimalist').then(m => m.MinimalistStory)),
    'minimalist_features': dynamic(() => import('@/components/templates/minimalist').then(m => m.MinimalistFeatures)),
    'minimalist_testimonials': dynamic(() => import('@/components/templates/minimalist').then(m => m.MinimalistTestimonials)),
    'minimalist_faq': dynamic(() => import('@/components/templates/minimalist').then(m => m.MinimalistFAQ)),

    // Cyber Theme Sections
    'cyber_hero': dynamic(() => import('@/components/templates/cyber').then(m => m.CyberHero)),
    'cyber_specs': dynamic(() => import('@/components/templates/cyber').then(m => m.CyberSpecs)),
    'cyber_features': dynamic(() => import('@/components/templates/cyber').then(m => m.CyberFeatures)),
    'cyber_testimonials': dynamic(() => import('@/components/templates/cyber').then(m => m.CyberTestimonials)),
    'cyber_cta': dynamic(() => import('@/components/templates/cyber').then(m => m.CyberCTA)),
};

/**
 * Get a section component by type
 */
export function getSectionComponent(type: string): ComponentType<SectionProps> | null {
    return sectionComponents[type] || null;
}

/**
 * Check if a section type exists in the registry
 */
export function sectionExists(type: string): boolean {
    return type in sectionComponents;
}

/**
 * Get all available section types
 */
export function getAvailableSections(): string[] {
    return Object.keys(sectionComponents);
}

/**
 * Get sections grouped by theme
 */
export function getSectionsByTheme(): Record<string, string[]> {
    const sections = getAvailableSections();
    const grouped: Record<string, string[]> = {};

    for (const section of sections) {
        const theme = section.split('_')[0];
        if (!grouped[theme]) {
            grouped[theme] = [];
        }
        grouped[theme].push(section);
    }

    return grouped;
}

// Default section orders for each theme
export const defaultLayouts: Record<string, string[]> = {
    organic: [
        'organic_hero',
        'organic_benefits',
        'organic_trust',
        'organic_testimonials',
        'organic_faq',
    ],
    minimalist: [
        'minimalist_hero',
        'minimalist_story',
        'minimalist_features',
        'minimalist_testimonials',
        'minimalist_faq',
    ],
    cyber: [
        'cyber_hero',
        'cyber_specs',
        'cyber_features',
        'cyber_testimonials',
        'cyber_cta',
    ],
};
