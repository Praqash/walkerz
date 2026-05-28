import BookingExperience from "@/components/booking/BookingExperience";
import SiteHeader from "@/components/layout/SiteHeader";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <HeroSection />
      <BookingExperience />
      <GallerySection />
    </main>
  );
}
