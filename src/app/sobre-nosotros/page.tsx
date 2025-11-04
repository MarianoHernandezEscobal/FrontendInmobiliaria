import ContactForm from "@/components/form-contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaMapMarkerAlt, FaRegEnvelope, FaPhoneAlt } from "react-icons/fa";

export const metadata = {
  title: "Contáctanos",
  description: "Ponte en contacto con nuestro equipo",
};

  const team = [
    {
      name: "Marcela Escobal",
      role: "Agente Inmobiliaria",
      image: "/team/Marcela.jpeg",
    },
    {
      name: "Gerardo Hernández",
      role: "Agente Inmobiliario",
      image: "/team/Gerardo.jpeg",
    },
  ]

export default function OurPage() {
  return (
    <div>
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background z-0">
        <img
          src="/fotosInmo.jpg"
          alt="La Paloma, Rocha"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
          Tu hogar en
          <br />
          La Paloma
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-black">
          Más de 10 años ayudando a encontrar la propiedad perfecta en el balneario más hermoso de Rocha, Uruguay
        </p>
      </div>
    </section>
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Conectamos personas con su lugar ideal
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Desde hace más de una década, nos especializamos en el alquiler y venta de casas, cabañas y terrenos en La
              Paloma, uno de los balnearios más encantadores de Rocha, Uruguay.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Ya sea que busques una casa para vacacionar, una inversión inmobiliaria o el terreno perfecto para
              construir tu sueño, nuestro conocimiento profundo del mercado local y compromiso personalizado te
              garantizan encontrar exactamente lo que necesitas.
            </p>
            <Button size="lg" className="font-medium">
              Ver propiedades disponibles
            </Button>
          </div>

          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <img
              src="/la-paloma-houses-beach-properties.jpg"
              alt="Propiedades en La Paloma"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
      <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">      

        {/* Team */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">Nuestro equipo</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Profesionales dedicados con profundo conocimiento del mercado inmobiliario de La Paloma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {team.map((member) => (
            <Card key={member.name} className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
