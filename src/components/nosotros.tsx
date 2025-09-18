"use client"

import type { AgentProps } from "@/types/agents"
import Image from "next/image"
import Link from "next/link"
import { FaBuilding, FaWhatsapp, FaEnvelope, FaArrowRight } from "react-icons/fa"

const agentsData: AgentProps[] = [
  {
    name: "Marcela Escobar",
    oficina: "(+598) 4479 8463",
    whatsapp: "095786120",
    email: "consultas@inmobiliariacostaazul.com",
    imageUrl: "/team/Marcela.jpeg",
  },
  {
    name: "Gerardo Hernández",
    oficina: "(+598) 4479 8463",
    whatsapp: "098384860",
    email: "gerardo@inmobiliaricostaazul.com",
    imageUrl: "/team/Gerardo.jpeg",
  },
]

export default function AgentHome() {
  return (
    <div className="w-full flex flex-col items-center p-6 mt-6">
      <h1 className="text-2xl font-semibold uppercase tracking-widest mb-2 bg-clip-text text-transparent bg-gradient-to-r from-nav to-nav-foreground">
        Conoce a nuestro equipo
      </h1>
      <p className="text-muted-foreground text-center mb-2">
        Póngase en contacto con nuestros agentes inmobiliarios profesionales.
      </p>
      <div className="h-1 w-4/5 bg-nav rounded-full mb-8"></div>

      <div className="flex flex-col gap-6 max-w-3xl w-full">
        {agentsData.map((agent, index) => (
          <article
            key={index}
            className="flex flex-col md:flex-row items-center bg-card text-card-foreground rounded-lg shadow p-4 gap-4 border border-border"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0 relative">
              <Image
                src={agent.imageUrl || "/placeholder.svg"}
                alt={agent.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
              <p className="text-muted-foreground mb-1 flex items-center">
                <FaBuilding className="mr-2 text-accent" />
                <a href={`tel:${agent.oficina}`} className="hover:text-primary ml-1">
                  {agent.oficina}
                </a>
              </p>
              <p className="text-muted-foreground mb-1 flex items-center">
                <FaWhatsapp className="mr-2 text-accent" />
                <a href={`tel:${agent.whatsapp}`} className="hover:text-primary ml-1">
                  {agent.whatsapp}
                </a>
              </p>
              <p className="text-muted-foreground mb-1 flex items-center min-w-0 w-full">
                <FaEnvelope className="mr-2 text-accent h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${agent.email}`} className="hover:text-primary ml-1 break-all sm:break-normal min-w-0">
                  {agent.email}
                </a>
              </p>
            </div>

            <Link href="/contacto" className="text-accent hover:text-primary text-2xl">
              <FaArrowRight />
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
