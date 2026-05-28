import CabinIcon from "@mui/icons-material/Cabin";

const navItems = [
  { label: "Rooms", href: "#rooms" },
  { label: "Booking", href: "#booking" },
  { label: "Transaction", href: "#transaction" },
  { label: "Gallery", href: "#gallery" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <a href="#top" className="brand" aria-label="Walkerz home">
          <CabinIcon />
          <span>Walkerz</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
