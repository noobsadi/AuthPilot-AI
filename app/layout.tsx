import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AICopilot from "@/components/AICopilot";

export const metadata: Metadata = {
  title: "AuthPilot AI — Healthcare Prior Authorization Copilot",
  description:
    "AI copilot for faster, cleaner prior authorization workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 backdrop-blur-sm px-4 py-3 text-xs text-amber-800 flex items-start gap-2 shadow-card">
            <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold">
              i
            </span>
            <div>
              <span className="font-semibold">Demo only.</span> Not medical
              advice. No real patient data used. Final clinical decisions
              remain with licensed clinicians and payer reviewers.
            </div>
          </div>
        </footer>
        <AICopilot />
      </body>
    </html>
  );
}
