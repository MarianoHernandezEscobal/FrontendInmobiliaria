import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import FooterModern from "@/components/footer";
import { PropertyProvider } from "@/context/property-context";
import { FiltersProvider } from "@/context/filters-context";
import WhatsappButton from "@/components/whatsapp-button";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inmobiliaria Costa Azul",
  description: "Venta y alquiler de propiedades en la costa uruguaya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <UserProvider>
          <PropertyProvider>
            <FiltersProvider>
              <Navbar />
              {children}

              <WhatsappButton />
              <FooterModern />
            </FiltersProvider>
          </PropertyProvider>
        </UserProvider>
      </body>
    </html>
  );
}
