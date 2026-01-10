import { OrganicHero, OrganicBenefits, OrganicTrust } from "@/components/templates/organic";

export default function Home() {
  return (
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

      {/* TODO: Add more sections */}
      {/* <OrganicTestimonials /> */}
      {/* <OrganicFAQ /> */}
      {/* <OrganicCTA /> */}
      {/* <Footer /> */}
    </main>
  );
}
