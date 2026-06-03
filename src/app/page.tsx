import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CoreHrSection } from "@/components/core-hr-section";
import { BuiltForEveryone } from "@/components/built-for-everyone";
import { IntegrationsSection } from "@/components/integrations-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FooterSection } from "@/components/footer-section";

export default function Home() {
  return (
    <main className="kairo-scroll relative h-screen overflow-x-clip overflow-y-auto">
      <Navbar />
      <Hero />
      <CoreHrSection />
      <BuiltForEveryone />
      <IntegrationsSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
