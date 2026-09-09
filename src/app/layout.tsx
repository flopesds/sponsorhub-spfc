import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const sofia = Sofia_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SponsorHub | SPFC",
  description: "Gestão Integrada de Patrocínios e Ativações",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={sofia.className}
        style={{ margin: 0, backgroundColor: "#0A0D10", color: "#FFFFFF" }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
