// components/WhatsappButton.tsx
"use client";

import { FaWhatsapp } from "react-icons/fa";
import { usePathname  } from "next/navigation";
import { URL_INMO } from "@/constants/constants";
const WhatsappButton = () => {

  const pathname = usePathname()

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=+59898384860&text=${encodeURIComponent(
        `Hola, estoy interesado en tu propiedad: ${URL_INMO}${pathname}`
      )}&app_absent=1`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 flex items-center gap-2"
    >
      <span className="hidden md:inline font-medium text-sm">
        Envianos tu mensaje
      </span>

      <div className="hidden md:block w-px h-6 bg-white opacity-50" />
      <FaWhatsapp className="text-4xl md:text-2xl" />
    </a>
  );
};

export default WhatsappButton;
