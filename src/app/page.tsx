import { CallToAction, Footer } from "@/components/cta-footer";
import { Destinations } from "@/components/destinations";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { HowToBook } from "@/components/how-to-book";
import { Navbar } from "@/components/navbar";
import { Packages } from "@/components/packages";
import { Pricing } from "@/components/pricing";
import { Stories } from "@/components/stories";

const HOME = "bkk";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Packages />
        <Destinations home={HOME} />
        <Pricing />
        <HowToBook />
        <Stories />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
