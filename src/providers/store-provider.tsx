'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig, getThemeById, THEMES } from '@/lib/themes';

interface Store {
    id: string;
    name: string;
    domain?: string;
    slug: string;
    theme?: string; // ID of the base theme (e.g., 'organic', 'bold')
    primary_color?: string;
    accent_color?: string;
    background_color?: string;
    text_color?: string;
    theme_settings?: {
        fonts?: {
            heading?: string;
            body?: string;
        };
        radius?: string;
        buttonStyle?: string;
        heroLayout?: string;
    };
    content?: any;
}

interface StoreContextType {
    store: Store | null;
    currentTheme: ThemeConfig | null;
    isLoading: boolean;
}

const StoreContext = createContext<StoreContextType>({
    store: null,
    currentTheme: null,
    isLoading: true,
});

interface StoreProviderProps {
    children: ReactNode;
    initialStore?: Store | null;
}

export function StoreProvider({ children, initialStore }: StoreProviderProps) {
    const [store, setStore] = useState<Store | null>(initialStore || null);
    const [isLoading, setIsLoading] = useState(!initialStore);

    // Derive the current effective theme combining base theme + store overrides
    const currentTheme = store?.theme ? getThemeById(store.theme) || THEMES[0] : THEMES[0];

    useEffect(() => {
        if (initialStore) {
            setStore(initialStore);
            setIsLoading(false);
        }
    }, [initialStore]);

    // Apply theme variables to CSS root
    useEffect(() => {
        if (!store || !currentTheme) return;

        const root = document.documentElement;

        // Colors (prefer store overrides, fallback to theme defaults)
        const colors = {
            primary: store.primary_color || currentTheme.colors.primary,
            accent: store.accent_color || currentTheme.colors.accent,
            background: store.background_color || currentTheme.colors.background,
            text: store.text_color || currentTheme.colors.text,
        };

        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-accent', colors.accent);
        root.style.setProperty('--color-background', colors.background);
        root.style.setProperty('--color-text', colors.text);

        // Fonts
        const headingFont = store.theme_settings?.fonts?.heading || currentTheme.fonts.heading;
        const bodyFont = store.theme_settings?.fonts?.body || currentTheme.fonts.body;

        // We might need to handle font loading here or in layout. 
        // For now assuming system fonts or Google Fonts loaded in layout match these names
        root.style.setProperty('--font-heading', headingFont);
        root.style.setProperty('--font-body', bodyFont);

        // Radius
        const radiusMap: Record<string, string> = {
            none: '0',
            sm: '0.25rem',
            md: '0.5rem',
            lg: '1rem',
            full: '9999px',
        };
        const radius = store.theme_settings?.radius || currentTheme.radius;
        root.style.setProperty('--radius', radiusMap[radius] || '0.5rem');

    }, [store, currentTheme]);

    return (
        <StoreContext.Provider value={{ store, currentTheme, isLoading }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
