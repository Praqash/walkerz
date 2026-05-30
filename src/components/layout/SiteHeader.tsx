import CabinIcon from "@mui/icons-material/Cabin";
import UserMenu from "@/components/auth/UserMenu";

const navItems = [
  { label: "Rooms", href: "#rooms" },
  { label: "Booking", href: "#booking" },
  { label: "Transaction", href: "#transaction" },
  { label: "Gallery", href: "#gallery" },
  { label: "Map", href: "#map" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <a href="#top" className="brand" aria-label="Walkerz home">
          <CabinIcon />
          <span>Walkerz</span>
        </a>
        <div className="header-actions">
          <nav className="nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
