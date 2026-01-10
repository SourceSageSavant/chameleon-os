import { createBrowserClient } from './supabase';

// Types matching our database schema
export interface Store {
    id: string;
    slug: string;
    name: string;
    domain: string | null;
    theme: string;
    primary_color: string;
    accent_color: string;
    background_color: string;
    text_color: string;
    logo_url: string | null;
    favicon_url: string | null;
    trust_badge_text: string;
    meta_title: string | null;
    meta_description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    store_id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    cost_per_item: number | null;
    sku: string | null;
    barcode: string | null;
    inventory_quantity: number;
    track_inventory: boolean;
    images: string[];
    thumbnail: string | null;
    badges: string[];
    features: Record<string, unknown>[];
    meta_title: string | null;
    meta_description: string | null;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    title: string;
    sku: string | null;
    price: number | null;
    compare_at_price: number | null;
    inventory_quantity: number;
    options: Record<string, unknown>;
    created_at: string;
}

// =============================================
// STORE QUERIES
// =============================================

export async function getStoreBySlug(slug: string): Promise<Store | null> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching store:', error);
        return null;
    }

    return data;
}

export async function getStoreByDomain(domain: string): Promise<Store | null> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('domain', domain)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching store by domain:', error);
        return null;
    }

    return data;
}

export async function getAllStores(): Promise<Store[]> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stores:', error);
        return [];
    }

    return data || [];
}

// =============================================
// PRODUCT QUERIES
// =============================================

export async function getProductsByStore(storeId: string): Promise<Product[]> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

export async function getProductBySlug(storeId: string, slug: string): Promise<Product | null> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data;
}

export async function getFeaturedProducts(storeId: string, limit: number = 4): Promise<Product[]> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(limit);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return data || [];
}

export async function getAllProducts(): Promise<Product[]> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all products:', error);
        return [];
    }

    return data || [];
}

// =============================================
// PRODUCT VARIANTS
// =============================================

export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching variants:', error);
        return [];
    }

    return data || [];
}

// =============================================
// HELPER: Convert DB Product to App Product format
// =============================================

export function dbProductToAppProduct(dbProduct: Product): {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    badges: string[];
    features: string[];
    variants: { id: string; title: string; price: number }[];
    inStock: boolean;
} {
    return {
        id: dbProduct.slug, // Use slug as ID for URL compatibility
        slug: dbProduct.slug,
        title: dbProduct.title,
        description: dbProduct.description || '',
        price: Number(dbProduct.price),
        compareAtPrice: dbProduct.compare_at_price ? Number(dbProduct.compare_at_price) : undefined,
        images: dbProduct.images || [],
        badges: dbProduct.badges || [],
        features: Array.isArray(dbProduct.features)
            ? dbProduct.features.map(f => typeof f === 'string' ? f : JSON.stringify(f))
            : [],
        variants: [], // Will be populated separately if needed
        inStock: dbProduct.inventory_quantity > 0 || !dbProduct.track_inventory,
    };
}
