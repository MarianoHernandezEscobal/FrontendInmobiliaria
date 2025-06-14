import ContactForm from "@/components/form-contact";
import { FaMapMarkerAlt, FaRegEnvelope, FaPhoneAlt } from "react-icons/fa";

export const metadata = {
  title: "Contáctanos",
  description: "Ponte en contacto con nuestro equipo",
};

export default function ContactPage() {
  return (
    <div className="nav_padding mx-auto px-4 py-12 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-muted-foreground">
            Nos encantaría saber de ti. Completa el formulario a continuación y
            te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card rounded-lg shadow-sm p-6 border order-1 md:order-1">
            <ContactForm />
          </div>

          <div className="space-y-6 order-2 md:order-2">
            <div>
              <h3 className="text-lg font-semibold">Nuestra Oficina</h3>
              <a
                href="https://maps.app.goo.gl/fkmjw6pSBghbo5Je8"
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center mb-2 hover:text-accent  hover:underline"
              >
                <FaMapMarkerAlt className="h-15 w-5 text-nav" />
                <div className="ml-4">
                  <p>
                    Inmobiliaria Costa Azul
                    <br />
                    Yaneo esq. Zapicán, La Paloma
                    <br />
                    Rocha, Uruguay
                  </p>
                </div>
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Correo Electrónico</h3>
              <a
                href="mailto:consultas@inmobiliariacostaazul.com"
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center hover:text-accent  hover:underline"
              >
                <FaRegEnvelope className="h-10 w-5 text-nav" />
                <div className="ml-4">
                  <p>consultas@inmobiliariacostaazul.com</p>
                </div>
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Llámanos</h3>
              <a
                href="tel:+59898384860"
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center hover:text-accent hover:underline"
              >
                <FaPhoneAlt className="h-10 w-5 text-nav" />
                <div className="ml-4">
                  <p>+598 98 384 860</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
