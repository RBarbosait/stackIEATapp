import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "src/components/CookieConsent.tsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creador de Menú",
  description: "Crea menús basados en tus ingredientes disponibles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}