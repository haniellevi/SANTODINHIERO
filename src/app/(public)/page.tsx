import { LandingHero } from "@/components/marketing/landing-hero"
import { LandingFeatures } from "@/components/marketing/landing-features"
import { PricingSection } from "@/components/marketing/pricing-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <LandingHero />
        <PricingSection />
        <LandingFeatures />
      </main>
    </div>
  )
}
