import { OrganicHero, OrganicBenefits, OrganicTrust, OrganicFAQ, OrganicTestimonials } from "@/components/templates/organic";
import { Header, CartDrawer, Footer } from "@/components/ui";

export default function Home() {
  return (
    <>
      {/* Header with Navigation */}
      <Header
        logoText="CreatinePro"
        trustBadgeText="NSF Certified for Sport • Free Shipping Over $50"
        navLinks={[
          { label: 'Shop', href: '/products' },
          { label: 'Benefits', href: '#benefits' },
          { label: 'Certifications', href: '#trust' },
          { label: 'FAQ', href: '#faq' },
        ]}
      />

      {/* Cart Drawer (slides in from right) */}
      <CartDrawer />

      <main>
        {/* Hero Section */}
        <OrganicHero
          productName="Premium Creatine Gummies"
          tagline="The Only Gummy with 2.5g Per Serving"
          description="NSF Certified for Sport. No more handfuls of pills or chalky powders. Just 2 gummies for your full daily dose."
          badges={['NSF Certified', 'Made in USA', '2.5g Per Gummy']}
          ctaText="Shop Now — $34.99"
          ctaLink="/products"
        />

        {/* Benefits Section */}
        <OrganicBenefits
          title="Why Athletes Choose Us"
          subtitle="Backed by science. Trusted by professionals. Made for you."
        />

        {/* Trust & Certifications Section */}
        <OrganicTrust
          title="Verified Purity"
          subtitle="In a market full of '0g creatine' scandals, we prove what's in every bottle."
        />

        {/* Testimonials Section */}
        <OrganicTestimonials
          title="What Athletes Are Saying"
          subtitle="Join thousands of athletes who trust us for their training"
        />

        {/* FAQ Section */}
        <OrganicFAQ
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our creatine gummies."
        />
      </main>

      {/* Footer */}
      <Footer
        logoText="CreatinePro"
        description="Premium creatine gummies backed by science. NSF Certified for Sport."
        copyrightText="© 2026 CreatinePro. All rights reserved."
      />
    </>
  );
}


