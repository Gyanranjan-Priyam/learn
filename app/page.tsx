import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  Pricing,
  CTA,
  Footer,
} from "@/components/landing"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
