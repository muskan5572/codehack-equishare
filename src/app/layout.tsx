import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EquiShare | Institutional Equipment & Resource Governance",
  description: "A trusted platform that helps universities, research labs, and communities safely share underused high-value equipment, spaces, and fabrication tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
        {children}
      </body>
    </html>
  );
}
