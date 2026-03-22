import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Gallery />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}