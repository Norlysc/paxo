import { Clients } from "@/components/Clients";
import { ContactSection } from "@/components/ContactSection";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Process } from "@/components/Process";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Suppliers } from "@/components/Suppliers";
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
        <Clients />
        <ServicesGrid />
        <WhyUsSection />
        <Process />
        <Testimonials />
        <Faq />
        <ContactSection />
        <Suppliers />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
