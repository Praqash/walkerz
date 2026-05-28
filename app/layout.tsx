import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
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
      <body>
        <AuthShell>{children}</AuthShell>
      </body>
    </html>
  );
}
