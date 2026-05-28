import CollectionsIcon from "@mui/icons-material/Collections";
import SectionHeader from "@/components/ui/SectionHeader";

export default function GallerySection() {
  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <SectionHeader
          eyebrow="Gallery"
          title="Minimal mountain stay"
          description="A quiet visual space for Walkerz, designed to feel warm, simple, and close to Manali's mountain landscape."
        />

        <div className="gallery-card card">
          <div className="gallery-icon" aria-hidden="true">
            <CollectionsIcon />
          </div>
          <span>Minimal mountain stay</span>
          <h2>Walkerz</h2>
          <p>Comfortable rooms, warm hospitality, and quick booking for travelers visiting Manali.</p>
        </div>
      </div>
    </section>
  );
}
