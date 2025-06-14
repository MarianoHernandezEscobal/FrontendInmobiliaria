import type React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";

export default function FooterModern() {
  return (
    <footer className="bg-nav text-primary-foreground">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Inmobiliaria Costa Azul</h2>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              Tu socio inmobiliario en la costa de Rocha. Ofrecemos las mejores
              propiedades en venta.
            </p>
            <div className="flex space-x-3">
              <div className="flex space-x-3">
                <SocialLink
                  href="https://www.facebook.com/inmobiliariacostaazul.lapaloma"
                  icon={<FaFacebook size={18} />}
                  label="Facebook"
                  hoverClassName="hover:bg-[#1877F2] hover:text-white"
                />
                <SocialLink
                  href="https://wa.me/59898384860"
                  icon={<FaWhatsapp size={18} />}
                  label="WhatsApp"
                  hoverClassName="hover:bg-[#25D366] hover:text-white"
                />
                <SocialLink
                  href="https://www.youtube.com/@inmobiliariacostaazul3259"
                  icon={<FaYoutube size={18} />}
                  label="YouTube"
                  hoverClassName="hover:bg-[#FF0000] hover:text-white"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 ">
              <FooterLink href="/propiedades">Propiedades</FooterLink>
              <FooterLink href="/terrenos">Terrenos</FooterLink>
              <FooterLink href="/sobre-nosotros">Sobre Nosotros</FooterLink>
              <FooterLink href="/contacto">Contacto</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start hover:text-white hover:font-bold">
                <MapPin className="mr-2 h-5 w-5 text-primary-foreground/80 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/fkmjw6pSBghbo5Je8"
                  className="text-primary-foreground/80 hover:text-white hover:font-bold"
                >
                  Yaneo esq Zapican, La Paloma, Rocha, Uruguay
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary-foreground/80" />
                <a
                  href="tel:+59898384860"
                  className="text-primary-foreground/80 hover:text-white hover:font-bold"
                >
                  +598 98 384 860
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary-foreground/80" />
                <a
                  href="mailto:consultas@inmobiliariacostaazul.com"
                  className="text-primary-foreground/80 hover:text-white hover:font-bold transition-colors"
                >
                  info@inmobiliariacostaazul.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-primary-foreground/80 mb-4">
              Suscríbete para recibir las últimas propiedades y noticias
              inmobiliarias
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-l-md text-white placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="bg-white text-primary px-3 py-2 rounded-r-md hover:bg-white/90 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/70 mb-4 md:mb-0">
            © {new Date().getFullYear()} Inmobiliaria Costa Azul. Todos los
            derechos reservados.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link
              href="/terminos"
              className="text-primary-foreground/70 hover:text-white transition-colors"
            >
              Términos y Condiciones
            </Link>
            <Link
              href="/privacidad"
              className="text-primary-foreground/70 hover:text-white transition-colors"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
  hoverClassName = "hover:bg-white hover:text-primary",
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hoverClassName?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-8 w-8 flex items-center justify-center rounded-full bg-white/10 text-white transition-colors ${hoverClassName}`}
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-primary-foreground/80 hover:text-white transition-colors hover:text-white hover:font-bold"
      >
        {children}
      </Link>
    </li>
  );
}
