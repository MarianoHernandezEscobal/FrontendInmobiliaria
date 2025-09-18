import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterModern from "@/components/footer";
import { PropertyProvider } from "@/context/property-context";
import { FiltersProvider } from "@/context/filters-context";
import WhatsappButton from "@/components/whatsapp-button";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/user-context";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inmobiliaria Costa Azul - Venta y alquiler en La Paloma, Rocha",
  description:
    "Inmobiliaria Costa Azul ofrece venta y alquiler de casas, terrenos, apartamentos y campos en La Paloma, Rocha y otros balnearios de la costa uruguaya.",
  keywords: [
    "inmobiliaria",
    "costa azul",
    "inmobiliaria costa azul",
    "casas en Anaconda",
    "alquiler en Anaconda",
    "venta en Anaconda",
    "terrenos en Anaconda",
    "apartamentos en Anaconda",
    "inmobiliaria en Anaconda",
    "propiedades en Anaconda",
    "campos en Anaconda",
    "real estate Anaconda Uruguay",
    "inversión inmobiliaria en Anaconda",

    "casas en Antoniopolis",
    "alquiler en Antoniopolis",
    "venta en Antoniopolis",
    "terrenos en Antoniopolis",
    "apartamentos en Antoniopolis",
    "inmobiliaria en Antoniopolis",
    "propiedades en Antoniopolis",
    "campos en Antoniopolis",
    "real estate Antoniopolis Uruguay",
    "inversión inmobiliaria en Antoniopolis",

    "casas en Arachania",
    "alquiler en Arachania",
    "venta en Arachania",
    "terrenos en Arachania",
    "apartamentos en Arachania",
    "inmobiliaria en Arachania",
    "propiedades en Arachania",
    "campos en Arachania",
    "real estate Arachania Uruguay",
    "inversión inmobiliaria en Arachania",

    "casas en Atlántica",
    "alquiler en Atlántica",
    "venta en Atlántica",
    "terrenos en Atlántica",
    "apartamentos en Atlántica",
    "inmobiliaria en Atlántica",
    "propiedades en Atlántica",
    "campos en Atlántica",
    "real estate Atlántica Uruguay",
    "inversión inmobiliaria en Atlántica",

    "casas en Barrio Country",
    "alquiler en Barrio Country",
    "venta en Barrio Country",
    "terrenos en Barrio Country",
    "apartamentos en Barrio Country",
    "inmobiliaria en Barrio Country",
    "propiedades en Barrio Country",
    "campos en Barrio Country",
    "real estate Barrio Country Uruguay",
    "inversión inmobiliaria en Barrio Country",

    "casas en Barrio Parque",
    "alquiler en Barrio Parque",
    "venta en Barrio Parque",
    "terrenos en Barrio Parque",
    "apartamentos en Barrio Parque",
    "inmobiliaria en Barrio Parque",
    "propiedades en Barrio Parque",
    "campos en Barrio Parque",
    "real estate Barrio Parque Uruguay",
    "inversión inmobiliaria en Barrio Parque",

    "casas en Cerro Áspero Garzón",
    "alquiler en Cerro Áspero Garzón",
    "venta en Cerro Áspero Garzón",
    "terrenos en Cerro Áspero Garzón",
    "apartamentos en Cerro Áspero Garzón",
    "inmobiliaria en Cerro Áspero Garzón",
    "propiedades en Cerro Áspero Garzón",
    "campos en Cerro Áspero Garzón",
    "real estate Cerro Áspero Garzón Uruguay",
    "inversión inmobiliaria en Cerro Áspero Garzón",

    "casas en Costa Azul",
    "alquiler en Costa Azul",
    "venta en Costa Azul",
    "terrenos en Costa Azul",
    "apartamentos en Costa Azul",
    "inmobiliaria en Costa Azul",
    "propiedades en Costa Azul",
    "campos en Costa Azul",
    "real estate Costa Azul Uruguay",
    "inversión inmobiliaria en Costa Azul",

    "casas en La Aguada",
    "alquiler en La Aguada",
    "venta en La Aguada",
    "terrenos en La Aguada",
    "apartamentos en La Aguada",
    "inmobiliaria en La Aguada",
    "propiedades en La Aguada",
    "campos en La Aguada",
    "real estate La Aguada Uruguay",
    "inversión inmobiliaria en La Aguada",

    "casas en La Paloma",
    "alquiler en La Paloma",
    "venta en La Paloma",
    "terrenos en La Paloma",
    "apartamentos en La Paloma",
    "inmobiliaria en La Paloma",
    "propiedades en La Paloma",
    "campos en La Paloma",
    "real estate La Paloma Uruguay",
    "inversión inmobiliaria en La Paloma",

    "casas en La Pedrera",
    "alquiler en La Pedrera",
    "venta en La Pedrera",
    "terrenos en La Pedrera",
    "apartamentos en La Pedrera",
    "inmobiliaria en La Pedrera",
    "propiedades en La Pedrera",
    "campos en La Pedrera",
    "real estate La Pedrera Uruguay",
    "inversión inmobiliaria en La Pedrera",

    "casas en Oceanía del Polonio",
    "alquiler en Oceanía del Polonio",
    "venta en Oceanía del Polonio",
    "terrenos en Oceanía del Polonio",
    "apartamentos en Oceanía del Polonio",
    "inmobiliaria en Oceanía del Polonio",
    "propiedades en Oceanía del Polonio",
    "campos en Oceanía del Polonio",
    "real estate Oceanía del Polonio Uruguay",
    "inversión inmobiliaria en Oceanía del Polonio",

    "casas en Playa Serena",
    "alquiler en Playa Serena",
    "venta en Playa Serena",
    "terrenos en Playa Serena",
    "apartamentos en Playa Serena",
    "inmobiliaria en Playa Serena",
    "propiedades en Playa Serena",
    "campos en Playa Serena",
    "real estate Playa Serena Uruguay",
    "inversión inmobiliaria en Playa Serena",

    "casas en Pueblo Nuevo",
    "alquiler en Pueblo Nuevo",
    "venta en Pueblo Nuevo",
    "terrenos en Pueblo Nuevo",
    "apartamentos en Pueblo Nuevo",
    "inmobiliaria en Pueblo Nuevo",
    "propiedades en Pueblo Nuevo",
    "campos en Pueblo Nuevo",
    "real estate Pueblo Nuevo Uruguay",
    "inversión inmobiliaria en Pueblo Nuevo",

    "casas en Punta Rubia",
    "alquiler en Punta Rubia",
    "venta en Punta Rubia",
    "terrenos en Punta Rubia",
    "apartamentos en Punta Rubia",
    "inmobiliaria en Punta Rubia",
    "propiedades en Punta Rubia",
    "campos en Punta Rubia",
    "real estate Punta Rubia Uruguay",
    "inversión inmobiliaria en Punta Rubia",

    "casas en Rocha",
    "alquiler en Rocha",
    "venta en Rocha",
    "terrenos en Rocha",
    "apartamentos en Rocha",
    "inmobiliaria en Rocha",
    "propiedades en Rocha",
    "campos en Rocha",
    "real estate Rocha Uruguay",
    "inversión inmobiliaria en Rocha",

    "casas en San Antonio",
    "alquiler en San Antonio",
    "venta en San Antonio",
    "terrenos en San Antonio",
    "apartamentos en San Antonio",
    "inmobiliaria en San Antonio",
    "propiedades en San Antonio",
    "campos en San Antonio",
    "real estate San Antonio Uruguay",
    "inversión inmobiliaria en San Antonio",

    "casas en San Sebastián de La Pedrera",
    "alquiler en San Sebastián de La Pedrera",
    "venta en San Sebastián de La Pedrera",
    "terrenos en San Sebastián de La Pedrera",
    "apartamentos en San Sebastián de La Pedrera",
    "inmobiliaria en San Sebastián de La Pedrera",
    "propiedades en San Sebastián de La Pedrera",
    "campos en San Sebastián de La Pedrera",
    "real estate San Sebastián de La Pedrera Uruguay",
    "inversión inmobiliaria en San Sebastián de La Pedrera",

    "casas en Santa Isabel",
    "alquiler en Santa Isabel",
    "venta en Santa Isabel",
    "terrenos en Santa Isabel",
    "apartamentos en Santa Isabel",
    "inmobiliaria en Santa Isabel",
    "propiedades en Santa Isabel",
    "campos en Santa Isabel",
    "real estate Santa Isabel Uruguay",
    "inversión inmobiliaria en Santa Isabel",

    "casas en Sierra de Rocha",
    "alquiler en Sierra de Rocha",
    "venta en Sierra de Rocha",
    "terrenos en Sierra de Rocha",
    "apartamentos en Sierra de Rocha",
    "inmobiliaria en Sierra de Rocha",
    "propiedades en Sierra de Rocha",
    "campos en Sierra de Rocha",
    "real estate Sierra de Rocha Uruguay",
    "inversión inmobiliaria en Sierra de Rocha"
  ],
  authors: [
    {
      name: "Inmobiliaria Costa Azul",
      url: "https://inmobiliariacostaazul.com",
    },
  ],
  creator: "Inmobiliaria Costa Azul",
  publisher: "Inmobiliaria Costa Azul",
  openGraph: {
    title: "Inmobiliaria Costa Azul",
    description:
      "Encontrá tu próxima propiedad en la costa uruguaya. Casas, terrenos y apartamentos en venta y alquiler en La Paloma, Rocha y más.",
    url: "https://inmobiliariacostaazul.com",
    siteName: "Inmobiliaria Costa Azul",
    images: [
      {
        url: "/logoColorFondo.png",
        width: 800,
        height: 600,
        alt: "Logo Inmobiliaria Costa Azul",
      },
    ],
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmobiliaria Costa Azul",
    description:
      "Venta y alquiler de propiedades en la costa uruguaya. Casas, terrenos y apartamentos en Rocha.",
    images: ["/logoColorFondo.png"],
  },
  icons: {
    icon: "/logoColorFondo.png",
    shortcut: "/logoColorFondo.png",
    apple: "/logoColorFondo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  metadataBase: new URL("https://inmobiliariacostaazul.com"),
  alternates: {
    canonical: "https://inmobiliariacostaazul.com",
    languages: {
      "es-UY": "https://inmobiliariacostaazul.com",
    },
  },
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
