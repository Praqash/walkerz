import DirectionsIcon from "@mui/icons-material/Directions";
import MapIcon from "@mui/icons-material/Map";
import SectionHeader from "@/components/ui/SectionHeader";

const googleMapsLink = "https://maps.app.goo.gl/JPJv4i3eM3F6pQ758?g_st=am";
const mapCoordinates = "26.82942475,80.9960207";
const mapEmbedUrl =
  `https://maps.google.com/maps?q=${mapCoordinates}&ll=${mapCoordinates}&z=16&output=embed`;

export default function MapSection() {
  return (
    <section id="map" className="section map-section">
      <div className="container">
        <SectionHeader
          eyebrow="Location"
          title="Find Walkerz on Google Maps"
          description="Use the map preview to orient yourself before arrival, then open directions in Google Maps when you are ready to travel."
        />

        <div className="map-layout">
          <div className="map-frame card">
            <iframe
              title="Walkerz centered location on Google Maps"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="map-details card">
            <div className="gallery-icon" aria-hidden="true">
              <MapIcon />
            </div>
            <span>Walkerz, Manali</span>
            <h2>Plan your route before check-in.</h2>
            <p>
              Open the shared Google Maps location for live directions, traffic,
              and nearby route options.
            </p>
            <a
              className="primary-button"
              href={googleMapsLink}
              target="_blank"
              rel="noreferrer"
            >
              <DirectionsIcon fontSize="small" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
