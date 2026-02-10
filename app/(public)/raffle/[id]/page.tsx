import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, DollarSign, ShoppingCart, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DrawTrigger, RaffleStatus } from "@/app/generated/prisma/enums";

import { formatPrice } from "@/lib/utils";

import { GetRaffleByIdPublic } from "@/services/raffle";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function RaffleIdPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raffle = await GetRaffleByIdPublic(id, true);

  if (!raffle || raffle.status !== RaffleStatus.ACTIVE) {
    redirect("/");
  }

  return (
    <div className="grid w-full grid-cols-2 gap-6 p-6 md:p-12">
      <section
        id="image-raffle"
        className="col-span-full flex flex-col gap-4 md:col-span-1"
      >
        {raffle.image && (
          <Image
            src={raffle.image}
            alt={raffle.title}
            width={800}
            height={800}
            quality={75}
            loading="eager"
            className="aspect-square w-full rounded-sm object-cover"
          />
        )}
      </section>
      <section
        id="info-raffle"
        className="col-span-full flex flex-col gap-4 md:col-span-1"
      >
        <h1 className="text-2xl font-semibold md:text-4xl">{raffle.title}</h1>

        <div className="flex w-full justify-between gap-x-4">
          <Card className="w-full gap-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-1 text-lg md:text-xl">
                <Ticket className="text-primary" />
                Números
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base md:text-lg">{raffle.totalNumbers}</p>
              <p className="text-muted-foreground">Totales</p>
            </CardContent>
          </Card>

          <Card className="w-full gap-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-1 text-lg md:text-xl">
                <Calendar className="text-primary" />
                Sorteo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {raffle.drawTrigger === DrawTrigger.VENDER_TODO ? (
                <p className="text-base md:text-lg">
                  Al vender todos los números
                </p>
              ) : (
                <>
                  <p className="text-base md:text-lg">
                    {raffle.drawDate
                      ? format(new Date(raffle.drawDate), "dd/MMM/yy", {
                          locale: es,
                        })
                      : "Fecha no definida"}
                  </p>
                  {raffle.drawDate && (
                    <p className="text-muted-foreground text-sm">
                      {format(new Date(raffle.drawDate), "HH:mm", {
                        locale: es,
                      })}{" "}
                      hs
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-x-1 text-lg md:text-xl">
              <DollarSign className="text-primary" />
              Precio por número
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between gap-x-2">
              <p className="text-lg md:text-xl">
                {formatPrice(raffle.numberPrice)}
              </p>
              <p className="font-semibold">
                <span className="text-primary">{raffle.numbersSold}</span>/
                {raffle.totalNumbers} vendidos
              </p>
            </div>
            <Progress
              value={(raffle.numbersSold / raffle.totalNumbers) * 100}
            />
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" asChild>
              <Link href={`/raffle/${id}/sold-number`}>
                Comprar número
                <ShoppingCart />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        {raffle.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Detalles de la rifa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{raffle.description}</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
