import BookingExperience from "@/components/booking/BookingExperience";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";
import MapSection from "@/components/sections/MapSection";
import SupportSection from "@/components/sections/SupportSection";

export default function Home() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <HeroSection />
      <BookingExperience />
      <GallerySection />
      <MapSection />
      <SupportSection />
      <SiteFooter />
    </main>
  );
}
