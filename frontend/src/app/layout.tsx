import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ForwardCheck AI — Don't just check the claim. Explore the truth behind it.",
  description:
    "Evidence-grounded forensic investigation platform for viral forwards, screenshots, posters, and audio notes using TruthGraph™ and the explainable Bait Index™.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col desk-lamp-ambience text-[#F1E8D9] selection:bg-[#DC2626]/30 selection:text-white">
        {/* Soft Ambient Desk-Lamp Beam in Background */}
        <div className="fixed top-0 right-0 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
