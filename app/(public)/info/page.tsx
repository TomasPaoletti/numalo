import { Button } from "@/components/ui/button";
import {
  Calculator,
  FilePlus,
  Info,
  Megaphone,
  Scale,
  ShoppingBag,
  Shuffle,
  Trophy,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Numeralo — Cómo funciona",
  description:
    "Entendé cómo funciona Numeralo: creación de rifas, gestión de pagos, tipos de sorteo y responsabilidades.",
};

const STEPS = [
  {
    n: "01",
    icon: FilePlus,
    title: "Creación de la rifa",
    desc: "El organizador define el premio, la cantidad de números disponibles y el precio de cada uno. También elige el tipo de sorteo y la condición de cierre (por fecha o al vender todos los números).",
  },
  {
    n: "02",
    icon: Megaphone,
    title: "Publicación",
    desc: "El organizador abona la tarifa de publicación de Numeralo a través de Mercado Pago. La rifa se activa y recibe un link único para compartir con sus participantes por cualquier canal.",
  },
  {
    n: "03",
    icon: ShoppingBag,
    title: "Compra de números",
    desc: "Los participantes ingresan al link, eligen sus números y los pagan por transferencia bancaria a la cuenta del organizador, subiendo el comprobante del pago para reservarlos.",
  },
  {
    n: "04",
    icon: Wallet,
    title: "Gestión de pagos",
    desc: "El pago de los números se transfiere directo a la cuenta bancaria del organizador, que revisa y aprueba cada comprobante para confirmar la venta. Numeralo no retiene ni administra esos fondos en ningún momento.",
  },
  {
    n: "05",
    icon: Trophy,
    title: "El sorteo",
    desc: "El organizador puede optar por sorteo aleatorio —el sistema elige al ganador entre los números vendidos— o por Quiniela Nacional, ingresando el número oficial y el sistema calcula el ganador.",
  },
  {
    n: "06",
    icon: Scale,
    title: "Responsabilidad",
    desc: "Cada organizador es responsable de cumplir con la normativa legal y fiscal vigente en su jurisdicción. Numeralo actúa únicamente como intermediario tecnológico y no garantiza las rifas publicadas.",
  },
];

const DRAW_TYPES = [
  {
    icon: Shuffle,
    title: "Sorteo aleatorio",
    desc: "El sistema elige al ganador de forma aleatoria entre todos los números vendidos al momento del cierre. Transparente, automático e inmediato.",
    tags: ["Automático", "Inmediato"],
  },
  {
    icon: Calculator,
    title: "Quiniela Nacional",
    desc: "El ganador se determina por el resultado oficial de la Quiniela Nacional argentina. El organizador ingresa el número ganador y el sistema lo mapea al número correspondiente de la rifa.",
    tags: ["Oficial", "Verificable"],
  },
];

export default function InfoPage() {
  return (
    <main>
      <section
        className="border-border relative overflow-hidden border-b px-6 py-20"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, oklch(0.541 0.281 293 / 0.12) 0%, transparent 65%)",
        }}
      >
        <div className="relative z-10 mx-auto">
          <span className="text-primary mb-3 block text-[11.5px] font-semibold tracking-[0.09em] uppercase">
            Cómo funciona
          </span>
          <h1 className="mb-4 text-[52px] leading-[1.1] font-bold tracking-[-0.025em] text-pretty">
            Simple, transparente y directo
          </h1>
          <p className="text-muted-foreground text-[16.5px] leading-[1.7]">
            Numeralo conecta a organizadores de rifas con sus participantes. Acá
            te explicamos cada paso del proceso, de principio a fin.
          </p>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="px-6 py-20">
        <div className="mx-auto">
          <div className="flex flex-col">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <div
                key={n}
                className="relative grid gap-5"
                style={{
                  gridTemplateColumns: "52px 1fr",
                  paddingBottom: i < STEPS.length - 1 ? 36 : 0,
                }}
              >
                {i < STEPS.length - 1 && (
                  <div
                    className="bg-border absolute"
                    style={{ left: 25, top: 56, width: 2, bottom: 0 }}
                  />
                )}
                <div className="flex flex-col items-center">
                  <div className="border-primary/28 bg-primary/13 text-primary flex h-[52px] w-[52px] flex-shrink-0 flex-col items-center justify-center rounded-full border">
                    <span className="font-mono text-[10.5px] leading-none font-semibold tracking-[.02em]">
                      {n}
                    </span>
                    <Icon size={13} className="text-primary/70 mt-0.5" />
                  </div>
                </div>
                <div className="pt-3">
                  <h2 className="mb-2 text-[20px] font-semibold tracking-[-0.015em]">
                    {title}
                  </h2>
                  <p className="text-muted-foreground text-[15px] leading-[1.75] text-pretty">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border bg-muted/38 border-t px-6 py-20">
        <div className="mx-auto">
          <h2 className="mb-1.5 text-[22px] font-bold tracking-tight">
            Tipos de sorteo
          </h2>
          <p className="text-muted-foreground mb-7 text-[15px] leading-relaxed">
            El organizador elige el modo de sorteo al crear su rifa.
          </p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {DRAW_TYPES.map(({ icon: Icon, title, desc, tags }) => (
              <div
                key={title}
                className="border-border bg-card flex flex-col gap-3 rounded-[14px] border p-6"
              >
                <span className="bg-primary/14 text-primary flex h-[42px] w-[42px] items-center justify-center rounded-[10px]">
                  <Icon size={22} />
                </span>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="text-muted-foreground text-[14.5px] leading-relaxed">
                  {desc}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-primary/24 bg-primary/12 text-primary inline-block rounded-full border px-2.5 py-0.5 text-[12px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto">
          <div className="border-border bg-muted/50 flex items-start gap-3 rounded-[12px] border px-5 py-4">
            <Info
              size={18}
              className="text-muted-foreground mt-px flex-shrink-0"
            />
            <div>
              <h3 className="mb-1.5 text-[15px] font-semibold">
                Responsabilidad de los organizadores
              </h3>
              <p className="text-muted-foreground text-[14.5px] leading-[1.7] text-pretty">
                Numeralo no organiza, administra ni garantiza ninguna de las
                rifas publicadas. Mercado Pago se utiliza solo para abonar la
                tarifa de activación; la compra de números se realiza por
                transferencia bancaria directa entre participante y organizador.
                Cada organizador es responsable del cumplimiento legal, fiscal y
                contractual con sus participantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 pb-24">
        <div className="mx-auto">
          <div
            className="border-primary/24 rounded-[18px] border p-12 text-center"
            style={{
              background: "color-mix(in oklch, var(--primary) 9%, var(--card))",
            }}
          >
            <h2 className="mb-3 text-[30px] font-bold tracking-tight text-balance">
              ¿Todo claro? Empezá a crear tu rifa
            </h2>
            <p className="text-muted-foreground mx-auto mb-7 text-[15.5px] leading-relaxed">
              El registro es gratuito. Pagás solo cuando publicás tu rifa.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button size="lg" asChild>
                <Link href="/register">Registrarme gratis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
