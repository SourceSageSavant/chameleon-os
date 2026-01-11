'use client';

import { Suspense } from 'react';
import { getSectionComponent, defaultLayouts, SectionProps } from '@/lib/section-registry';

// =============================================================================
// PAGE LAYOUT TYPES
// =============================================================================

export interface PageSection {
    id: string;
    type: string;
    props?: SectionProps;
    visible?: boolean;
}

export interface PageLayout {
    id?: string;
    name?: string;
    theme: 'organic' | 'minimalist' | 'cyber' | 'bold' | 'luxury';
    sections: PageSection[];
    globalProps?: SectionProps;
}

// =============================================================================
// PAGE RENDERER - Renders pages from JSON layout definitions
// =============================================================================

interface PageRendererProps {
    layout: PageLayout;
    fallbackTheme?: 'organic' | 'minimalist' | 'cyber';
}

function SectionFallback() {
    return (
        <div className="py-12 animate-pulse">
            <div className="container mx-auto px-4">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
            </div>
        </div>
    );
}

export function PageRenderer({ layout, fallbackTheme = 'organic' }: PageRendererProps) {
    // If no sections defined, use default layout for the theme
    const sections: PageSection[] = layout.sections.length > 0
        ? layout.sections
        : (defaultLayouts[layout.theme] || defaultLayouts[fallbackTheme]).map((type, index) => ({
            id: `section-${index}`,
            type,
            props: {},
            visible: true,
        }));


    return (
        <>
            {sections.map((section) => {
                // Skip invisible sections
                if (section.visible === false) {
                    return null;
                }

                const Component = getSectionComponent(section.type);

                if (!Component) {
                    // In development, show a warning for missing sections
                    if (process.env.NODE_ENV === 'development') {
                        return (
                            <div key={section.id} className="bg-yellow-50 border border-yellow-200 p-4 my-2">
                                <p className="text-yellow-800 font-mono text-sm">
                                    ⚠️ Unknown section type: <strong>{section.type}</strong>
                                </p>
                            </div>
                        );
                    }
                    return null;
                }

                // Merge global props with section-specific props
                const mergedProps: SectionProps = {
                    ...layout.globalProps,
                    ...section.props,
                    id: section.id,
                };

                return (
                    <Suspense key={section.id} fallback={<SectionFallback />}>
                        <Component {...mergedProps} />
                    </Suspense>
                );
            })}
        </>
    );
}

// =============================================================================
// UTILITY: Generate default layout for a theme
// =============================================================================

export function generateDefaultLayout(
    theme: 'organic' | 'minimalist' | 'cyber',
    globalProps?: SectionProps
): PageLayout {
    const sectionTypes = defaultLayouts[theme] || defaultLayouts.organic;

    return {
        theme,
        sections: sectionTypes.map((type, index) => ({
            id: `${theme}-section-${index}`,
            type,
            props: {},
        })),
        globalProps,
    };
}

// =============================================================================
// UTILITY: Create a layout from AI-generated brand data
// =============================================================================

export function createLayoutFromBrand(
    brand: {
        theme: string;
        storeName: string;
        tagline: string;
        productTitle: string;
        productDescription: string;
        trustBadges?: string[];
        faqItems?: Array<{ question: string; answer: string }>;
    },
    productImage?: string
): PageLayout {
    const theme = (brand.theme as 'organic' | 'minimalist' | 'cyber') || 'organic';

    return generateDefaultLayout(theme, {
        productName: brand.productTitle,
        tagline: brand.tagline,
        description: brand.productDescription,
        heroImage: productImage,
        trustBadges: brand.trustBadges,
        faqItems: brand.faqItems,
    });
}

export default PageRenderer;
