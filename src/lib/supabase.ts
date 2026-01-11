import { createClient } from '@supabase/supabase-js';

// Browser client (for client-side operations)
export function createBrowserClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseAnonKey);
}

// Server client (for server-side operations with elevated privileges)
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Admin operations may fail.');
    }

    return createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

// Public server client (for fetching public data on server)
export function createServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseAnonKey);
}

// Singleton for middleware (reuse connection)
let middlewareClient: ReturnType<typeof createClient> | null = null;

export function getMiddlewareClient() {
    if (!middlewareClient) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase credentials not configured. Using mock data.');
            return null;
        }

        middlewareClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return middlewareClient;
}
