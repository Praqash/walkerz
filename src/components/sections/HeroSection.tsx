import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function HeroSection() {
  return (
    <section id="top" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow icon-text">
            <LocationOnIcon fontSize="small" />
            Manali homestay hotel
          </p>
          <h1>Book a quiet stay at Walkerz in Manali.</h1>
          <p>
            Browse available rooms, reserve your preferred stay, and review the transaction details in a simple booking flow.
          </p>
          <a className="primary-button" href="#booking">
            <CalendarMonthIcon fontSize="small" />
            Start booking
          </a>
        </div>
        <div className="hero-card card">
          <span>Minimal mountain stay</span>
          <h2>Walkerz</h2>
          <p>Comfortable rooms, warm hospitality, and quick booking for travelers visiting Manali.</p>
        </div>
      </div>
    </section>
  );
}
