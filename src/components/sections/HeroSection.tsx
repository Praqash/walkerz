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
          <a className="primary-button" href="#booking">
            <CalendarMonthIcon fontSize="small" />
            Start booking
          </a>
        </div>
      </div>
    </section>
  );
}
