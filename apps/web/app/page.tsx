import { ContactSection } from "@/components/ContactSection";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Testimonials } from "@/components/Testimonials";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { WhyUsSection } from "@/components/WhyUsSection";

export default function HomePage() {
  return (
    <>
      <PageViewTracker />
      <Header />
      <main>
        <Hero />
        <ServicesGrid />
        <Gallery />
        <Testimonials />
        <Faq />
        <WhyUsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
