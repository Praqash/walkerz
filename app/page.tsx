import BookingExperience from "@/components/booking/BookingExperience";
import SiteHeader from "@/components/layout/SiteHeader";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";
import MapSection from "@/components/sections/MapSection";

export default function Home() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <HeroSection />
      <BookingExperience />
      <GallerySection />
      <MapSection />
    </main>
  );
}
