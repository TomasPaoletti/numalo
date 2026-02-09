"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

import {
  formatPrice,
  getDrawMethodLabel,
  getDrawTriggerLabel,
} from "@/lib/utils";

import { DrawTrigger } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumeItemProps {
  label: string;
  value: string | React.ReactNode;
  span?: "col-span-1" | "col-span-full";
}

const ResumeItem = ({ label, value, span = "col-span-1" }: ResumeItemProps) => (
  <div className={`${span} flex flex-col gap-2`}>
    <p className="font-medium">{label}</p>
    <div className="text-muted-foreground">{value}</div>
  </div>
);

const SectionResumeCreate = () => {
  const { watch } = useFormContext();

  const title = watch("title");
  const totalNumbers = watch("totalNumbers");
  const numberPrice = watch("numberPrice");
  const description = watch("description");
  const hasQuantityDiscount = watch("hasQuantityDiscount");
  const quantity = watch("quantity");
  const percentage = watch("percentage");
  const image = watch("image");
  const drawMethod = watch("drawMethod");
  const drawTrigger = watch("drawTrigger");
  const drawDate = watch("drawDate");

  const formatComision = () => {
    const price = totalNumbers * numberPrice;
    const comision = (price * 2) / 100;

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(comision);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {title && <ResumeItem label="Nombre de la rifa" value={title} />}

          {totalNumbers && (
            <ResumeItem
              label="Cantidad de números"
              value={`${totalNumbers} números`}
            />
          )}

          {numberPrice && (
            <ResumeItem
              label="Precio por número"
              value={formatPrice(numberPrice)}
            />
          )}

          {description && (
            <ResumeItem
              label="Descripción"
              value={<p className="line-clamp-3">{description}</p>}
              span="col-span-full"
            />
          )}

          {hasQuantityDiscount && quantity && percentage && (
            <ResumeItem
              label="Descuento por cantidad"
              value={`${quantity} números = ${percentage}% de descuento`}
            />
          )}

          {drawMethod && (
            <ResumeItem
              label="Método de sorteo"
              value={getDrawMethodLabel(drawMethod)}
            />
          )}

          {drawTrigger && (
            <ResumeItem
              label="Cuándo se sortea"
              value={getDrawTriggerLabel(drawTrigger)}
            />
          )}

          {drawDate && drawTrigger === DrawTrigger.FECHA_FIJA && (
            <ResumeItem
              label="Fecha y hora del sorteo"
              value={format(drawDate, "dd/MM/yyyy - HH:mm", { locale: es })}
            />
          )}
          {image && (
            <ResumeItem
              label="Imagen"
              value={
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Preview "
                    fill
                    className="object-cover"
                  />
                </div>
              }
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <ResumeItem
            span="col-span-full"
            label={`Por esta rifa pagarás ${formatComision()}`}
            value="Numeralo cobra el 2% del total del valor de la rifa. Es decir, si ofreces 100 numeros a 1000$, te cobraremos 2000$"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default SectionResumeCreate;
