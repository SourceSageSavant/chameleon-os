import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for middleware
// using direct createClient to ensure edge compatibility and fresh instance per request if needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// List of paths that should bypass store resolution
// We want to skip static files, API routes (except maybe some that need store context?), and admin
const BYPASS_PATHS = [
    '/admin',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/placeholder',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for admin routes, and static files
    if (BYPASS_PATHS.some(path => pathname.startsWith(path)) || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Parse the host to determine store
    const host = request.headers.get('host') || '';

    // Default development hosts - check if it's localhost or a preview URL
    const isDev = host.includes('localhost') || host.includes('127.0.0.1') || host.endsWith('.vercel.app');

    const response = NextResponse.next();

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        let storeId: string | null = null;
        let storeDomain: string | null = null;

        // 1. Try to find store by custom domain (priority)
        if (!storeId) {
            const { data: domainStore } = await supabase
                .from('stores')
                .select('id, domain')
                .eq('domain', host)
                .eq('is_active', true)
                .single();

            if (domainStore) {
                storeId = domainStore.id;
                storeDomain = domainStore.domain;
            }
        }

        // 2. Try to find by subdomain (e.g. store-slug.host.com)
        if (!storeId) {
            const subdomain = host.split('.')[0];
            // Avoid matching 'www' as a store slug if possible, or handle it
            if (subdomain !== 'www') {
                const { data: subdomainStore } = await supabase
                    .from('stores')
                    .select('id, slug')
                    .eq('slug', subdomain)
                    .eq('is_active', true)
                    .single();

                if (subdomainStore) {
                    storeId = subdomainStore.id;
                }
            }
        }

        // 3. Fallback: Get the first active store (default)
        // This ensures the app always loads SOMETHING, acting as the "main" store
        if (!storeId) {
            const { data: defaultStore } = await supabase
                .from('stores')
                .select('id')
                .eq('is_active', true)
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            if (defaultStore) {
                storeId = defaultStore.id;
            }
        }

        // Set store ID in request headers for server components to read
        if (storeId) {
            response.headers.set('x-store-id', storeId);
            if (storeDomain) {
                response.headers.set('x-store-domain', storeDomain);
            }
        }

    } catch (error) {
        console.error('Middleware store resolution error:', error);
        // Continue without store resolution on error, allow app to handle missing context
    }

    return response;
}

export const config = {
    // Matcher ignoring static files and assets
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
