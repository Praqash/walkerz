import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walkerz Manali | Homestay Booking",
  description: "Book rooms at Walkerz, a minimal homestay hotel in Manali.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
