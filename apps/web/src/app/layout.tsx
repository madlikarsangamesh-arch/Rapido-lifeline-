import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rapid Lifeline — Ambulance Coordination Prototype",
  description:
    "Private ambulance coordination prototype. Booking, dispatch, hospital, and tracking integrations are not connected.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-50 text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
