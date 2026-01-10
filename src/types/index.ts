// Store configuration types
export interface StoreConfig {
  id: string;
  domain: string;
  medusa_channel_id?: string;
  theme_preset: ThemePreset;
  config: StoreDesignConfig;
  status: 'active' | 'maintenance' | 'killed';
  created_at: string;
}

export type ThemePreset = 'organic_v1' | 'minimalist_v1' | 'cyber_v1' | 'default';

export interface StoreDesignConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  assets: {
    logo_url: string;
    favicon_url?: string;
    hero_image_url?: string;
  };
  content: {
    store_name: string;
    tagline: string;
    description: string;
  };
  features: {
    show_reviews: boolean;
    countdown_timer: boolean;
    show_trust_badges: boolean;
    subscription_toggle: boolean;
  };
  seo: {
    title_template: string;
    meta_description: string;
    keywords: string[];
  };
}

// Product types
export interface Product {
  id: string;
  store_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  variants?: ProductVariant[];
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku?: string;
  inventory_quantity: number;
}

// Generated SEO page types
export interface GeneratedPage {
  id: string;
  store_id: string;
  slug: string;
  city: string;
  product_name: string;
  content: GeneratedContent;
  created_at: string;
}

export interface GeneratedContent {
  headline: string;
  intro: string;
  weather_tip: string;
  landmark_intro: string;
  buying_tip: string;
  seo_keywords: string[];
  shipping_note: string;
}

// City data for localized content
export interface CityData {
  city: string;
  country: string;
  region: string;
  climate: 'tropical' | 'temperate' | 'arid' | 'cold' | 'tropical_highland';
  average_temp_c: number;
  rainy_season?: string;
  primary_courier: string;
  avg_delivery_days: number;
  landmark: string;
  local_currency: string;
  timezone: string;
  population_tier: 'mega_city' | 'large' | 'medium' | 'small';
  lifestyle_note: string;
}

// Cart types
export interface CartItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Theme component props
export interface ThemeProps {
  store: StoreConfig;
  products?: Product[];
}
