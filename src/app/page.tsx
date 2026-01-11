import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { PageBuilder, ThemeType } from '@/components/PageBuilder';
import { Header, CartDrawer, Footer } from '@/components/ui';

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

interface Store {
  id: string;
  name: string;
  slug: string;
  theme: string;
  primary_color: string;
  trust_badge_text: string;
  meta_title: string;
  meta_description: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
}

async function getStoreAndProduct() {
  const supabase = getServerClient();
  if (!supabase) {
    return { store: null, product: null };
  }

  // Get the first active store (in production, you'd detect by domain/subdomain)
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (!store) {
    return { store: null, product: null };
  }

  // Get the first featured product for this store
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(1)
    .single();

  return { store, product };
}

export default async function Home() {
  const { store, product } = await getStoreAndProduct();

  // Fallback theme if no store found
  const theme: ThemeType = (store?.theme as ThemeType) || 'organic';
  const storeName = store?.name || 'Store';
  const trustBadge = store?.trust_badge_text || 'Free Shipping Over $50';

  // Product config for hero
  const productConfig = product ? {
    productName: product.title,
    description: product.description,
    heroImage: product.images?.[0] || '/product-hero.png',
    price: `$${Number(product.price).toFixed(2)}`,
    comparePrice: product.compare_at_price ? `$${Number(product.compare_at_price).toFixed(2)}` : undefined,
  } : {};

  // Theme-specific nav links
  const getNavLinks = () => {
    switch (theme) {
      case 'cyber':
        return [
          { label: 'Shop', href: '/products' },
          { label: 'Specs', href: '#specs' },
          { label: 'Features', href: '#features' },
        ];
      case 'minimalist':
        return [
          { label: 'Shop', href: '/products' },
          { label: 'Story', href: '#story' },
          { label: 'FAQ', href: '#faq' },
        ];
      default:
        return [
          { label: 'Shop', href: '/products' },
          { label: 'Benefits', href: '#benefits' },
          { label: 'FAQ', href: '#faq' },
        ];
    }
  };

  return (
    <>
      {/* Header with Navigation */}
      <Header
        logoText={storeName}
        trustBadgeText={trustBadge}
        navLinks={getNavLinks()}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      <main>
        {/* Dynamic Theme Sections */}
        <PageBuilder theme={theme} config={productConfig} />
      </main>

      {/* Footer */}
      <Footer
        logoText={storeName}
        description={store?.meta_description || `Welcome to ${storeName}`}
        copyrightText={`© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}
      />
    </>
  );
}
