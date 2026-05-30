import DirectionsIcon from "@mui/icons-material/Directions";
import MapIcon from "@mui/icons-material/Map";
import SectionHeader from "@/components/ui/SectionHeader";

const mapCoordinates = "26.82942475,80.9960207";
const googleMapsLink =
  "https://www.google.com/maps/place/Footsteps+Hostel+and+Cafe/@26.82942475,80.9960207,16z/data=!4m2!3m1!1s0x3904872e14e0ee1d:0x3ef650f083866127";
const mapEmbedUrl =
  `https://maps.google.com/maps?hl=en&q=${mapCoordinates}&ll=${mapCoordinates}&z=16&iwloc=B&output=embed`;

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
