import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  ArrowRight,
  Eye,
  FilePlus,
  Gift,
  MapPin,
  Settings2,
  Share2,
  ShieldCheck,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Numeralo — Rifas online para Argentina",
  },
  description:
    "Organizá tu rifa online, compartí el link y vendé números. Los participantes pagan por transferencia directa — sin intermediarios. La forma más simple de automatizar rifas en Argentina.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Numeralo — Rifas online para Argentina",
    description:
      "Organizá tu rifa online, compartí el link y vendé números. Cobros por transferencia directa — sin intermediarios.",
    url: "/",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Numeralo — Plataforma de rifas online",
      },
    ],
  },
  twitter: {
    title: "Numeralo — Rifas online para Argentina",
    description:
      "Organizá tu rifa online, compartí el link y vendé números. Cobros por transferencia directa — sin intermediarios.",
  },
};

const STEPS = [
  {
    n: "01",
    icon: FilePlus,
    title: "Creá tu rifa",
    desc: "Definí el premio, la cantidad de números y el precio por número. Elegí el tipo de sorteo y cuándo cierra.",
  },
  {
    n: "02",
    icon: Share2,
    title: "Compartí el link",
    desc: "Tu rifa tiene un link único. Compartilo por WhatsApp, Instagram o donde quieras para que los participantes compren.",
  },
  {
    n: "03",
    icon: Wallet,
    title: "Cobrás directo",
    desc: "Los participantes te transfieren directo a tu cuenta bancaria y suben el comprobante. Vos lo aprobás y el número queda vendido.",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Simple",
    desc: "Creá tu rifa en minutos. Sin conocimientos técnicos ni configuraciones complejas.",
  },
  {
    icon: Eye,
    title: "Transparente",
    desc: "Vos cobrás directo. Numeralo solo provee la plataforma — sin tocar el dinero en ningún momento.",
  },
  {
    icon: Settings2,
    title: "Flexible",
    desc: "Sorteo aleatorio o por Quiniela Nacional. Cierre por fecha o al vender todos los números.",
  },
  {
    icon: MapPin,
    title: "Para creadores argentinos",
    desc: "Pensado para el mercado local. Transferencias en pesos, precios en ARS y sorteos por la Quiniela Nacional.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://numeraloapp.com/#website",
      name: "Numeralo",
      url: "https://numeraloapp.com",
      description:
        "Plataforma para crear y gestionar rifas online en Argentina",
      inLanguage: "es-AR",
    },
    {
      "@type": "WebApplication",
      "@id": "https://numeraloapp.com/#app",
      name: "Numeralo",
      url: "https://numeraloapp.com",
      description:
        "Creá y automatizá rifas online en minutos. Vendé números, gestioná pagos por transferencia y sorteá de forma automática.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "es-AR",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ARS",
        description: "Registro gratuito. Pago por publicación de rifa.",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://numeraloapp.com/#organization",
      name: "Numeralo",
      url: "https://numeraloapp.com",
      contactPoint: {
        "@type": "ContactPoint",
        email: "contacto@send.numeraloapp.com",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ─── Hero ─── */}
      <section
        className="relative overflow-hidden px-6 py-24 text-center"
        style={{
          background:
            "radial-gradient(ellipse 110% 55% at 50% -5%, oklch(0.541 0.281 293 / 0.17) 0%, transparent 65%)",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
          <div className="border-primary/25 bg-primary/12 text-primary inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[13px] font-medium">
            <Gift size={13} />
            Tu primera rifa es gratis
          </div>

          <h1 className="max-w-3xl text-5xl leading-[1.06] font-bold tracking-[-0.03em] text-balance md:text-6xl lg:text-[68px]">
            Creá rifas. <span className="text-primary">Cobrá directo.</span>
          </h1>

          <p className="text-muted-foreground max-w-[560px] text-lg leading-relaxed">
            Organizá tu rifa, compartí el link y vendé números. Los
            participantes te transfieren directo a tu cuenta — Numeralo nunca
            toca el dinero.{" "}
            <span className="text-foreground font-medium">
              La primera rifa la publicás gratis.
            </span>
          </p>

          <div className="mt-1 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" asChild>
              <Link href="/register">
                Crear mi primera rifa <ArrowRight size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/info">Cómo funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Steps ─── */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-11 text-center">
            <span className="text-primary mb-2.5 block text-[11.5px] font-semibold tracking-[0.09em] uppercase">
              Cómo funciona
            </span>
            <h2 className="mx-auto max-w-md text-3xl font-bold tracking-tight">
              Tres pasos y ya estás sorteando
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <div
                key={n}
                className="border-border bg-card flex flex-col gap-3.5 rounded-[14px] border p-[22px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="border-primary/28 bg-primary/13 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border font-mono text-[13px] font-semibold">
                    {n}
                  </span>
                  <span className="bg-primary/16 text-primary flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px]">
                    <Icon size={18} />
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="text-muted-foreground text-[14.5px] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust ─── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="border-primary/24 bg-card grid items-center gap-9 rounded-[18px] border p-8 lg:grid-cols-2 lg:p-12">
            {/* Text */}
            <div>
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="bg-primary/16 text-primary flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-[11px]">
                  <ShieldCheck size={22} />
                </span>
                <span className="text-primary text-[11.5px] font-semibold tracking-[0.09em] uppercase">
                  Transparencia total
                </span>
              </div>
              <h2 className="mb-3.5 text-[30px] leading-snug font-bold tracking-tight text-pretty">
                El dinero siempre va directo a vos
              </h2>
              <p className="text-muted-foreground text-[15px] leading-[1.7]">
                Numeralo no retiene ni administra el dinero de las rifas. Los
                participantes transfieren directo a la cuenta bancaria del
                creador — Numeralo nunca interviene en ese pago. Mercado Pago se
                usa solo para activar la rifa.
              </p>
            </div>
            {/* Flow diagram */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <div className="border-border bg-card flex flex-col items-center gap-1 rounded-[10px] border px-4 py-3 text-[13px] font-medium">
                  <User size={20} />
                  Participante
                  <span className="text-muted-foreground text-[11px] font-normal">
                    paga
                  </span>
                </div>
                <ArrowRight size={18} className="text-muted-foreground" />
                <div className="border-primary/33 bg-primary/8 flex flex-col items-center gap-1 rounded-[10px] border px-4 py-3 text-[13px] font-medium">
                  <ArrowLeftRight size={20} />
                  Transferencia
                  <span className="text-muted-foreground text-[11px] font-normal">
                    directa
                  </span>
                </div>
                <ArrowRight size={18} className="text-muted-foreground" />
                <div className="flex flex-col items-center gap-1 rounded-[10px] border border-[--chart-1]/40 bg-[--chart-1]/9 px-4 py-3 text-[13px] font-medium text-[--chart-1]">
                  <Wallet size={20} />
                  Tu cuenta
                  <span className="text-muted-foreground text-[11px] font-normal">
                    recibe
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-center text-[12px] tracking-[.01em]">
                Numeralo actúa solo como plataforma tecnológica
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-11 text-center">
            <span className="text-primary mb-2.5 block text-[11.5px] font-semibold tracking-[0.09em] uppercase">
              Por qué Numeralo
            </span>
            <h2 className="mx-auto max-w-sm text-3xl font-bold tracking-tight">
              Pensado para quien organiza
            </h2>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="border-border bg-card flex flex-col gap-2.5 rounded-[14px] border p-[22px]"
              >
                <span className="bg-primary/16 text-primary flex h-[38px] w-[38px] items-center justify-center rounded-[10px]">
                  <Icon size={18} />
                </span>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div
            className="border-primary/24 rounded-[18px] border p-12 text-center"
            style={{
              background: "color-mix(in oklch, var(--primary) 9%, var(--card))",
            }}
          >
            <h2 className="mb-3 text-[34px] font-bold tracking-tight text-balance">
              Tu primera rifa es gratis
            </h2>
            <p className="text-muted-foreground mx-auto mb-7 max-w-md text-[15.5px] leading-relaxed">
              Registrate, creá tu rifa y publicala sin pagar nada. A partir de
              la segunda, pagás por publicación.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button size="lg" asChild>
                <Link href="/register">Crear mi primera rifa</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/info">Ver cómo funciona</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
