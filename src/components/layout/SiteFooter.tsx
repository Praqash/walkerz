import CabinIcon from "@mui/icons-material/Cabin";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com", icon: <InstagramIcon /> },
  { label: "X", href: "https://x.com", icon: <XIcon /> },
  { label: "Facebook", href: "https://www.facebook.com", icon: <FacebookIcon /> },
  { label: "YouTube", href: "https://www.youtube.com", icon: <YouTubeIcon /> },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <a href="#top" className="brand" aria-label="Walkerz home">
            <CabinIcon />
            <span>Walkerz</span>
          </a>
          <p>
            Comfortable rooms, warm hospitality, and simple online booking for
            travelers visiting Manali.
          </p>
        </div>

        <div className="footer-column">
          <h3>Contact us</h3>
          <a href="#support">Booking support</a>
          <a href="#map">Find us on map</a>
          <a href="#booking">Start booking</a>
        </div>

        <div className="footer-column">
          <h3>Social</h3>
          <div className="social-links" aria-label="Walkerz social links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          Copyright © {year} Walkerz. All rights reserved. Site content, images,
          room details, and booking material may not be copied or reused without
          permission.
        </p>
      </div>
    </footer>
  );
}
