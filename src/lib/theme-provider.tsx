'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { StoreConfig, StoreDesignConfig, ThemePreset } from '@/types';

interface ThemeContextType {
    theme: ThemePreset;
    config: StoreDesignConfig | null;
    storeId: string;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'organic_v1',
    config: null,
    storeId: 'default',
    isLoading: true,
});

// Default configs for each theme
const THEME_DEFAULTS: Record<ThemePreset, Partial<StoreDesignConfig>> = {
    organic_v1: {
        colors: {
            primary: '#2D5A27',      // Forest green
            secondary: '#F5F5DC',    // Beige
            accent: '#8B4513',       // Saddle brown
            background: '#FDFBF7',   // Off-white
            text: '#2C3E50',         // Dark gray
        },
    },
    minimalist_v1: {
        colors: {
            primary: '#000000',      // Black
            secondary: '#FFFFFF',    // White
            accent: '#333333',       // Dark gray
            background: '#FFFFFF',   // Pure white
            text: '#111111',         // Near black
        },
    },
    cyber_v1: {
        colors: {
            primary: '#00FF00',      // Neon green
            secondary: '#FF00FF',    // Neon pink
            accent: '#00FFFF',       // Cyan
            background: '#0A0A0A',   // Near black
            text: '#E0E0E0',         // Light gray
        },
    },
    default: {
        colors: {
            primary: '#3B82F6',      // Blue
            secondary: '#6366F1',    // Indigo
            accent: '#8B5CF6',       // Purple
            background: '#FFFFFF',   // White
            text: '#1F2937',         // Gray
        },
    },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemePreset>('organic_v1');
    const [config, setConfig] = useState<StoreDesignConfig | null>(null);
    const [storeId, setStoreId] = useState<string>('default');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, we'd read from cookies or fetch from API
        // For SSR, the middleware injects headers that we can read server-side
        // For CSR, we fetch the config

        async function loadThemeConfig() {
            try {
                // TODO: Fetch from API or read from server-injected data
                // For now, use the default organic theme
                const defaultTheme: ThemePreset = 'organic_v1';
                const defaultConfig = THEME_DEFAULTS[defaultTheme];

                setTheme(defaultTheme);
                setConfig(defaultConfig as StoreDesignConfig);
                setStoreId('default');

                // Apply CSS variables to document
                if (defaultConfig?.colors) {
                    const root = document.documentElement;
                    root.style.setProperty('--color-primary', defaultConfig.colors.primary!);
                    root.style.setProperty('--color-secondary', defaultConfig.colors.secondary!);
                    root.style.setProperty('--color-accent', defaultConfig.colors.accent!);
                    root.style.setProperty('--color-background', defaultConfig.colors.background!);
                    root.style.setProperty('--color-text', defaultConfig.colors.text!);
                }
            } catch (error) {
                console.error('Failed to load theme config:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadThemeConfig();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, config, storeId, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Server-side theme config getter (for use in server components)
export function getThemeConfig(theme: ThemePreset): Partial<StoreDesignConfig> {
    return THEME_DEFAULTS[theme] || THEME_DEFAULTS.default;
}
