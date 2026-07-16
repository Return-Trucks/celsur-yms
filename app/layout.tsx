import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShipmentX v6.1 | Celsur Operations Console",
  description: "Interactive Celsur logistics operations demo, ready for client presentation."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
