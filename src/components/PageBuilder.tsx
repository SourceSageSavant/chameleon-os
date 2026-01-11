'use client';

import { ReactNode } from 'react';

// Organic Theme Components
import { OrganicHero, OrganicBenefits, OrganicTrust, OrganicFAQ, OrganicTestimonials } from '@/components/templates/organic';

// Minimalist Theme Components
import { MinimalistHero, MinimalistStory, MinimalistFeatures, MinimalistTestimonials, MinimalistFAQ } from '@/components/templates/minimalist';

// Cyber Theme Components
import { CyberHero, CyberSpecs, CyberFeatures, CyberTestimonials, CyberCTA } from '@/components/templates/cyber';

export type ThemeType = 'organic' | 'minimalist' | 'cyber';

interface ThemeConfig {
    productName?: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
    price?: string;
    comparePrice?: string;
}

interface PageBuilderProps {
    theme: ThemeType;
    config?: ThemeConfig;
}

export function PageBuilder({ theme, config = {} }: PageBuilderProps) {
    const renderTheme = (): ReactNode => {
        switch (theme) {
            case 'minimalist':
                return (
                    <>
                        <MinimalistHero
                            productName={config.productName}
                            tagline={config.tagline}
                            description={config.description}
                            heroImage={config.heroImage}
                            price={config.price}
                            comparePrice={config.comparePrice}
                        />
                        <MinimalistStory />
                        <MinimalistFeatures />
                        <MinimalistTestimonials />
                        <MinimalistFAQ />
                    </>
                );

            case 'cyber':
                return (
                    <>
                        <CyberHero
                            productName={config.productName}
                            tagline={config.tagline}
                            description={config.description}
                            heroImage={config.heroImage}
                            price={config.price}
                            comparePrice={config.comparePrice}
                        />
                        <CyberSpecs />
                        <CyberFeatures />
                        <CyberTestimonials />
                        <CyberCTA />
                    </>
                );

            case 'organic':
            default:
                return (
                    <>
                        <OrganicHero
                            productName={config.productName}
                            tagline={config.tagline}
                            description={config.description}
                            heroImage={config.heroImage}
                        />
                        <OrganicBenefits />
                        <OrganicTrust />
                        <OrganicTestimonials />
                        <OrganicFAQ />
                    </>
                );
        }
    };

    return <>{renderTheme()}</>;
}

export default PageBuilder;
