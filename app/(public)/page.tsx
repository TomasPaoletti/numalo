import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Numeralo — Rifas online simples y transparentes",
  description: "Creá rifas online y recibí los pagos directamente en tu cuenta",
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-y-20 p-6 md:p-12">
      <section className="flex flex-col items-center gap-y-6 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Creá rifas online de forma simple y transparente
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Numeralo es una plataforma que te permite crear rifas online y vender
          números fácilmente. Los pagos se acreditan directamente en tu cuenta
          de Mercado Pago.
        </p>

        <div className="flex gap-x-4">
          <Button>
            <Link href="/register">Crear mi primera rifa</Link>
          </Button>
          <Button variant="outline">
            <Link href="/info">Cómo funciona</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-y-10 text-center md:grid-cols-3 md:gap-x-8">
        <div>
          <h3 className="mb-2 text-center text-xl font-semibold">
            1. Creá tu rifa
          </h3>
          <p className="text-muted-foreground">
            Definí el premio, la cantidad de números y el valor de cada uno.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-center text-xl font-semibold">
            2. Vendé números
          </h3>
          <p className="text-muted-foreground">
            Compartí tu rifa y permití que otros usuarios compren números.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold">
            3. Cobrá con Mercado Pago
          </h3>
          <p className="text-muted-foreground">
            El dinero se acredita directamente en tu cuenta de Mercado Pago.
          </p>
        </div>
      </section>

      <section>
        <Card className="">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold">
              Pagos claros y sin intermediarios
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Numeralo no recibe ni administra el dinero de las rifas. Todos los
              pagos son procesados por Mercado Pago y se acreditan directamente
              en la cuenta del creador de la rifa.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-y-8 md:grid-cols-2 md:gap-x-10">
        <div>
          <h3 className="mb-2 text-xl font-semibold md:text-center">
            Simple de usar
          </h3>
          <p className="text-muted-foreground md:text-center">
            Creá y gestioná tus rifas sin conocimientos técnicos.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold md:text-center">
            Transparente
          </h3>
          <p className="text-muted-foreground md:text-center">
            Vos cobrás directamente. Numeralo solo facilita la plataforma.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold md:text-center">Seguro</h3>
          <p className="text-muted-foreground md:text-center">
            Los pagos se realizan a través de Mercado Pago.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold md:text-center">
            Enfocado en creadores
          </h3>
          <p className="text-muted-foreground md:text-center">
            Pensado para personas que quieren organizar rifas de forma digital.
          </p>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardHeader className="text-center text-3xl font-semibold">
              Empezá a crear tu rifa hoy
            </CardHeader>
            <CardDescription className="text-center text-lg">
              Registrate gratis y publicá tu primera rifa en minutos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button>
              <Link href="/register">Crear mi primera rifa</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
