# ChameleonCommerceOS — Feature Development Roadmap

> **Purpose:** Comprehensive documentation of all features needed to reach industry parity and beyond.  
> **Structure:** Each feature includes the gap it fixes, why it's needed, implementation approach, and industry benchmark.

---

## Overview

| Phase | Focus | Timeline | Goal |
|-------|-------|----------|------|
| **Phase 1** | Critical Fixes | Week 1-2 | Can take real orders |
| **Phase 2** | Core Commerce | Week 3-4 | Shopify Basic parity |
| **Phase 3** | Advanced Commerce | Week 5-8 | Shopify Plus parity |
| **Phase 4** | God Tier / Moat | Week 9-16 | Features no one else has |

---

# Phase 1: Critical Fixes (Can't Sell Without These)

## 1.1 Wire Theme System to Middleware

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Middleware injects `x-store-theme` header, but `ThemeProvider` ignores it and defaults to `organic_v1` |
| **Why Needed** | Multi-tenancy is the core feature — stores look identical without this |
| **Industry Benchmark** | Shopify themes switch per store, BigCommerce has theme assignment per storefront |
| **Files to Modify** | `src/lib/theme-provider.tsx`, `src/app/layout.tsx` |

### Implementation Approach
```typescript
// In layout.tsx (Server Component)
import { headers } from 'next/headers';

export default function RootLayout({ children }) {
  const headersList = headers();
  const theme = headersList.get('x-store-theme') || 'organic_v1';
  const storeConfig = JSON.parse(headersList.get('x-store-config') || '{}');
  
  return (
    <ThemeProvider initialTheme={theme} initialConfig={storeConfig}>
      {children}
    </ThemeProvider>
  );
}
```

### Acceptance Criteria
- [ ] Store A with `theme: organic` shows organic theme
- [ ] Store B with `theme: cyber` shows cyber theme
- [ ] No page refresh needed when navigating

---

## 1.2 Checkout Success Page

| Attribute | Details |
|-----------|---------|
| **Current Gap** | `CheckoutForm.tsx` redirects to `/checkout/success` which doesn't exist (404) |
| **Why Needed** | Customer sees error page after paying — destroys trust |
| **Industry Benchmark** | All platforms have order confirmation with order number, thank you message |
| **Files to Create** | `src/app/checkout/success/page.tsx` |

### Implementation Approach
```typescript
// src/app/checkout/success/page.tsx
export default async function CheckoutSuccess({ searchParams }) {
  const { payment_intent } = searchParams;
  
  // 1. Verify payment with Stripe
  // 2. Create order in Supabase
  // 3. Clear cart (client-side via cookie or redirect param)
  // 4. Display confirmation
  
  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Order #{orderNumber}</p>
      <p>Confirmation email sent to {email}</p>
    </div>
  );
}
```

### Acceptance Criteria
- [ ] Payment success redirects to working page
- [ ] Order created in `orders` table with line items
- [ ] Cart is cleared after successful order
- [ ] Order number displayed to customer

---

## 1.3 Order Creation After Payment

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Payment goes to Stripe, but no order record is created in database |
| **Why Needed** | Can't fulfill orders if you don't know about them |
| **Industry Benchmark** | Every platform creates order record with customer info, items, totals |
| **Files to Modify** | `src/app/checkout/success/page.tsx`, new API route for order creation |

### Database Schema (Already Exists)
```sql
-- orders table already has:
-- id, store_id, order_number, customer_email, customer_name, 
-- line_items, subtotal, shipping_cost, total, payment_status, fulfillment_status
```

### Implementation Approach
```typescript
// In checkout success handler
const order = await supabase.from('orders').insert({
  store_id: storeId,
  order_number: await getNextOrderNumber(storeId),
  customer_email: paymentIntent.receipt_email,
  line_items: cartItems,
  subtotal: subtotal,
  shipping_cost: shipping,
  total: total,
  payment_status: 'paid',
  fulfillment_status: 'unfulfilled',
  stripe_payment_intent_id: payment_intent
});
```

### Acceptance Criteria
- [ ] Order appears in admin dashboard after payment
- [ ] Line items correctly captured
- [ ] Payment status = 'paid'
- [ ] Order number auto-increments per store

---

## 1.4 Order Confirmation Emails

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No email sent after purchase |
| **Why Needed** | Customers expect email confirmation — establishes trust, provides receipt |
| **Industry Benchmark** | Automatic on all platforms; Shopify, BigCommerce, SFCC all send instantly |
| **Dependencies** | Email provider (Resend, SendGrid, or Postmark) |

### Implementation Approach
```typescript
// Using Resend (simplest)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: `${storeName} <orders@${storeDomain}>`,
  to: customerEmail,
  subject: `Order Confirmation #${orderNumber}`,
  react: OrderConfirmationEmail({ order, store })
});
```

### Acceptance Criteria
- [ ] Email sent within 30 seconds of payment
- [ ] Contains order number, items, totals
- [ ] Store branding (logo, colors) in email
- [ ] Works for all stores (dynamic sender based on store config)

---

## 1.5 Discount/Coupon Codes

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No discount code functionality |
| **Why Needed** | Essential for marketing; every dropshipper uses "10OFF" type codes |
| **Industry Benchmark** | Shopify: percentage, fixed, free shipping, buy X get Y; BigCommerce similar |
| **Files to Create** | `src/app/admin/discounts/`, discount API route, checkout integration |

### Database Schema
```sql
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  code VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed', 'free_shipping'
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Implementation Approach
1. Admin UI to create/manage codes
2. Checkout field to enter code
3. API to validate code and calculate discount
4. Apply discount to PaymentIntent amount

### Acceptance Criteria
- [ ] Create discount in admin with code, type, value
- [ ] Customer can enter code at checkout
- [ ] Invalid/expired codes show error
- [ ] Discount reflected in order total
- [ ] Usage tracked per code

---

# Phase 2: Core Commerce (Shopify Basic Parity)

## 2.1 Customer Accounts

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Only guest checkout; no customer login |
| **Why Needed** | Repeat customers, order history, saved addresses |
| **Industry Benchmark** | All platforms have customer accounts with order history |
| **Implementation** | Supabase Auth for customers (separate from admin auth) |

### Implementation Approach
- Customer sign up/login pages
- Protected `/account` routes
- Order history view
- Saved addresses for faster checkout

### Acceptance Criteria
- [ ] Customer can register during checkout
- [ ] Customer can log in and see past orders
- [ ] Returning customer checkout is faster (pre-filled address)

---

## 2.2 Shipping Rate Configuration

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Hardcoded $5.99 / free over $50 |
| **Why Needed** | Different products have different shipping costs |
| **Industry Benchmark** | Shopify: flat rate, weight-based, carrier-calculated; BigCommerce similar |

### Implementation Options

**Option A: Simple Config (MVP)**
```typescript
// In store config
shipping: {
  flat_rate: 5.99,
  free_threshold: 50,
  rates: [
    { country: 'US', rate: 5.99 },
    { country: 'CA', rate: 9.99 },
  ]
}
```

**Option B: Carrier Integration (Advanced)**
- ShipEngine API
- EasyPost API
- Real-time rates from USPS, UPS, FedEx

### Acceptance Criteria
- [ ] Admin can configure shipping rates per store
- [ ] Checkout calculates correct shipping
- [ ] Support for free shipping threshold

---

## 2.3 Tax Calculation

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No tax calculation |
| **Why Needed** | Legal requirement for most jurisdictions |
| **Industry Benchmark** | Shopify: basic tax, Avalara integration; BigCommerce: TaxJar |

### Implementation Options

**Option A: Manual Tax Rates**
```typescript
tax_rates: [
  { state: 'CA', rate: 0.0725 },
  { state: 'TX', rate: 0.0825 },
]
```

**Option B: TaxJar/Avalara Integration**
- Automatic rate calculation by address
- Compliance reporting

### Acceptance Criteria
- [ ] Tax calculated based on shipping address
- [ ] Tax displayed separately at checkout
- [ ] Tax included in order total

---

## 2.4 Inventory Management

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Inventory in schema but not enforced at checkout |
| **Why Needed** | Prevent selling out-of-stock items |
| **Industry Benchmark** | All platforms prevent overselling |

### Implementation Approach
- Check inventory before adding to cart
- Reserve inventory during checkout
- Decrement inventory on successful order
- Show "Out of Stock" on product page

### Acceptance Criteria
- [ ] Can't add to cart if inventory = 0
- [ ] Inventory decrements after order
- [ ] Low stock warning in admin

---

## 2.5 Product Variants Builder

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Basic variant support, no builder UI |
| **Why Needed** | Products often have size, color, material options |
| **Industry Benchmark** | Shopify: up to 3 options, 100 variants; BigCommerce: unlimited |

### Implementation Approach
- Admin UI to define options (Size: S/M/L)
- Auto-generate variant combinations
- Per-variant pricing, inventory, images

### Acceptance Criteria
- [ ] Admin can add options to product
- [ ] Variants auto-generated
- [ ] Each variant has its own inventory

---

# Phase 3: Advanced Commerce (Shopify Plus Parity)

## 3.1 Workflow Automation

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No automation; everything manual |
| **Why Needed** | Automate repetitive tasks (tag high-value customers, notify on low stock) |
| **Industry Benchmark** | Shopify Flow (visual builder), Zapier integrations |

### Implementation Approach
```typescript
// Rule-based automation
interface AutomationRule {
  trigger: 'order_created' | 'inventory_low' | 'customer_created';
  conditions: Condition[];
  actions: Action[];
}

// Example: "When order > $100, tag customer as VIP"
{
  trigger: 'order_created',
  conditions: [{ field: 'total', operator: 'gt', value: 100 }],
  actions: [{ type: 'tag_customer', value: 'VIP' }]
}
```

### Acceptance Criteria
- [ ] Admin can create if/then rules
- [ ] Rules execute automatically on triggers
- [ ] Audit log of automation runs

---

## 3.2 Abandoned Cart Recovery

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No cart recovery |
| **Why Needed** | 70% of carts are abandoned; recovery emails convert 5-10% |
| **Industry Benchmark** | Shopify: native; most use Klaviyo ($20-100/mo) |

### Implementation Approach
1. Track cart creation with email (if captured)
2. Cron job: Find carts > 1 hour old with no order
3. Send recovery email with cart contents
4. Include discount code in email

### Acceptance Criteria
- [ ] Abandoned carts detected
- [ ] Recovery email sent after 1 hour
- [ ] Email contains cart items and checkout link
- [ ] Can include auto-generated discount

---

## 3.3 Multi-Currency Support

| Attribute | Details |
|-----------|---------|
| **Current Gap** | USD only |
| **Why Needed** | Sell to international customers |
| **Industry Benchmark** | Shopify Markets, BigCommerce multi-currency |

### Implementation Approach
- Store products in base currency
- Exchange rates from API (Open Exchange Rates)
- Display prices in visitor's currency
- Stripe handles multi-currency checkout

### Acceptance Criteria
- [ ] Visitor sees prices in their currency
- [ ] Exchange rates updated daily
- [ ] Checkout processes in local currency

---

## 3.4 Cross-Store Comparison Dashboard

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Analytics per store, but no comparison view |
| **Why Needed** | Core value prop — see all stores' performance side-by-side |
| **Industry Benchmark** | **No competitor has this** — unique to ChameleonOS |

### Implementation Approach
```typescript
// New admin route: /admin/compare
// Shows table:
| Store | Revenue | Orders | Conv. Rate | ROAS | Status |
|-------|---------|--------|------------|------|--------|
| Chair Store | $1,240 | 12 | 2.1% | 2.4x | 🟢 Scaling |
| Lamp Store | $89 | 2 | 0.3% | 0.4x | 🔴 Kill |
```

### Acceptance Criteria
- [ ] Side-by-side store comparison
- [ ] Sortable by any metric
- [ ] Visual status indicators

---

# Phase 4: God Tier Features (Your Moat)

## 4.1 Quick Store Cloning

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Must manually recreate each store |
| **Why Needed** | "This theme/setup works — duplicate it for new product" |
| **Industry Benchmark** | **No competitor offers 1-click store cloning** |

### Implementation Approach
```typescript
async function cloneStore(sourceId: string, newConfig: Partial<Store>) {
  const source = await getStore(sourceId);
  
  // Clone store config
  const newStore = await supabase.from('stores').insert({
    ...source,
    id: undefined,
    slug: newConfig.slug,
    name: newConfig.name,
    domain: newConfig.domain,
    created_at: undefined
  });
  
  // Optionally clone products
  if (newConfig.cloneProducts) {
    const products = await getProductsByStore(sourceId);
    // Insert products with new store_id
  }
}
```

### Acceptance Criteria
- [ ] 1-click clone in admin
- [ ] Choose what to clone (theme, products, settings)
- [ ] New store functional immediately

---

## 4.2 AI Store Launcher

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Manual store setup takes 30-60 minutes |
| **Why Needed** | "Paste a product URL → get a complete store" |
| **Industry Benchmark** | **No competitor has this** |

### Implementation Approach
1. User pastes AliExpress/Amazon URL
2. Scrape product details (title, images, price, description)
3. Gemini AI generates:
   - Brand name suggestions
   - Color scheme
   - Product descriptions
   - FAQ content
   - Trust badges
4. Create store with all content pre-filled

### Acceptance Criteria
- [ ] Paste URL → store created in < 2 minutes
- [ ] AI-generated unique content
- [ ] User can edit before publishing

---

## 4.3 Programmatic SEO Engine

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No SEO page generation |
| **Why Needed** | Free organic traffic at scale |
| **Industry Benchmark** | **No competitor has native AI SEO generation** |

### Implementation Approach
```typescript
// scripts/writer-bot.ts
async function generateSEOPages(productId: string) {
  const product = await getProduct(productId);
  const cities = await getCityList(); // 500+ cities
  
  for (const city of cities) {
    const content = await gemini.generate({
      prompt: `Write a product page for ${product.name} targeting ${city.name}.
               Include local references, weather considerations, shipping info.`
    });
    
    await supabase.from('generated_pages').insert({
      product_id: productId,
      city_id: city.id,
      slug: `best-${product.slug}-in-${city.slug}`,
      content: content,
      meta_title: `Best ${product.name} in ${city.name} | ${storeName}`,
    });
  }
}
```

### Acceptance Criteria
- [ ] Generate 500+ unique pages per product
- [ ] Each page has unique content (AI-written)
- [ ] Auto-generated sitemap
- [ ] Internal linking between pages

---

## 4.4 Ad Spend Tracking

| Attribute | Details |
|-----------|---------|
| **Current Gap** | No way to track marketing spend vs revenue |
| **Why Needed** | Know which store is profitable |
| **Industry Benchmark** | Usually requires third-party tools ($50-200/mo) |

### Database Schema
```sql
CREATE TABLE ad_spend (
  id UUID PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  date DATE NOT NULL,
  platform VARCHAR(50), -- 'facebook', 'tiktok', 'google'
  spend DECIMAL(10,2) NOT NULL,
  impressions INTEGER,
  clicks INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Implementation Approach
- Manual entry or API integration (Meta Marketing API, TikTok)
- Calculate ROAS: Revenue / Ad Spend
- Show profit/loss per store

### Acceptance Criteria
- [ ] Log daily ad spend per store
- [ ] Calculate ROAS automatically
- [ ] Show profit/loss in comparison view

---

## 4.5 Winner/Loser Detection

| Attribute | Details |
|-----------|---------|
| **Current Gap** | Manual analysis of what's working |
| **Why Needed** | Automated alerts save time |
| **Industry Benchmark** | **No competitor has this specific feature** |

### Implementation Approach
```typescript
// Daily cron job
async function detectWinnersAndLosers() {
  const stores = await getAllStores();
  
  for (const store of stores) {
    const roas = await calculateROAS(store.id, '7d');
    
    if (roas >= 2.0) {
      await sendAlert(store, 'WINNER', `${store.name} has ${roas}x ROAS — scale it!`);
      await updateStoreStatus(store.id, 'scaling');
    } else if (roas < 0.5 && totalSpend > 50) {
      await sendAlert(store, 'LOSER', `${store.name} has ${roas}x ROAS — consider killing`);
      await updateStoreStatus(store.id, 'underperforming');
    }
  }
}
```

### Acceptance Criteria
- [ ] Automatic ROAS calculation
- [ ] Email/dashboard alerts for winners and losers
- [ ] Store status auto-updated

---

# Priority Order Summary

| # | Feature | Phase | Effort | Impact |
|---|---------|-------|--------|--------|
| 1 | Wire theme system | 1 | 2h | Critical |
| 2 | Checkout success page | 1 | 4h | Critical |
| 3 | Order creation | 1 | 4h | Critical |
| 4 | Order emails | 1 | 3h | Critical |
| 5 | Discount codes | 1 | 6h | High |
| 6 | Customer accounts | 2 | 8h | High |
| 7 | Shipping config | 2 | 4h | High |
| 8 | Tax calculation | 2 | 4h | Medium |
| 9 | Inventory enforcement | 2 | 4h | Medium |
| 10 | Cross-store comparison | 3 | 6h | High (Unique!) |
| 11 | Store cloning | 4 | 4h | High (Unique!) |
| 12 | AI store launcher | 4 | 16h | Highest (Moat!) |
| 13 | Programmatic SEO | 4 | 16h | Highest (Moat!) |
| 14 | Ad spend tracking | 4 | 6h | High (Unique!) |
| 15 | Winner detection | 4 | 4h | Medium (Unique!) |

---

# Quick Reference: Industry Parity Checklist

## Shopify Basic ($39/mo) Feature Parity
- [ ] Product CRUD ✅ (done)
- [ ] Order management ✅ (done)
- [ ] Checkout with Stripe ✅ (done)
- [ ] Discount codes
- [ ] Customer accounts
- [ ] Order emails
- [ ] Basic shipping
- [ ] Basic tax

## Shopify Plus ($2,300/mo) Feature Parity
- [ ] Everything above
- [ ] Multi-store management ✅ (done — you're ahead!)
- [ ] Workflow automation
- [ ] Advanced analytics ✅ (partially done)
- [ ] Abandoned cart recovery
- [ ] Multi-currency
- [ ] Theme export/import ✅ (done)

## God Tier (Features No One Has)
- [ ] Cross-store comparison dashboard
- [ ] 1-click store cloning
- [ ] AI store launcher from URL
- [ ] Programmatic SEO generation
- [ ] Integrated ad spend tracking
- [ ] Automatic winner/loser detection

---

*This document should be updated as features are completed. Check off items and note completion dates.*
