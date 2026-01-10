import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMiddlewareClient } from '@/lib/supabase';
import type { StoreConfig, ThemePreset } from '@/types';

// Default store config for development/fallback
const DEFAULT_STORE: Partial<StoreConfig> = {
    id: 'default',
    theme_preset: 'organic_v1' as ThemePreset,
    config: {
        colors: {
            primary: '#2D5A27',
            secondary: '#F5F5DC',
            accent: '#8B4513',
            background: '#FDFBF7',
            text: '#2C3E50',
        },
        assets: {
            logo_url: '/logo.png',
        },
        content: {
            store_name: 'Chameleon Store',
            tagline: 'Your Wellness Journey Starts Here',
            description: 'Premium supplements for peak performance',
        },
        features: {
            show_reviews: true,
            countdown_timer: false,
            show_trust_badges: true,
            subscription_toggle: true,
        },
        seo: {
            title_template: '%s | Chameleon Store',
            meta_description: 'Premium supplements for peak performance',
            keywords: ['supplements', 'wellness', 'health'],
        },
    },
    status: 'active',
};

// Domain to store mapping for local development
const LOCAL_DOMAIN_MAP: Record<string, string> = {
    'localhost:3000': 'default',
    'creatine.localhost:3000': 'creatine-gummies',
    'gaming.localhost:3000': 'gaming-store',
    // Add more local test domains here
};

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || 'localhost:3000';
    const pathname = request.nextUrl.pathname;

    // Skip middleware for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // Static files like favicon.ico
    ) {
        return NextResponse.next();
    }

    let store: Partial<StoreConfig> | null = null;

    // Try to get store from Supabase
    const supabase = getMiddlewareClient();

    if (supabase) {
        try {
            // First, check if this is a known domain
            const { data } = await supabase
                .from('stores')
                .select('*')
                .eq('domain', hostname)
                .eq('status', 'active')
                .single();

            if (data) {
                store = data as StoreConfig;
            }
        } catch (error) {
            console.log('Supabase lookup failed, using default store:', error);
        }
    }

    // Fallback: Check local domain map for development
    if (!store) {
        const localStoreId = LOCAL_DOMAIN_MAP[hostname];
        if (localStoreId && localStoreId !== 'default') {
            // In production, this would fetch from Supabase
            console.log(`Local development: Using store ID ${localStoreId}`);
        }
        store = DEFAULT_STORE;
    }

    // Create response with store data in headers
    const response = NextResponse.next();

    // Inject store data into request headers for downstream components
    response.headers.set('x-store-id', store.id || 'default');
    response.headers.set('x-store-theme', store.theme_preset || 'organic_v1');
    response.headers.set('x-store-config', JSON.stringify(store.config || {}));

    return response;
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
