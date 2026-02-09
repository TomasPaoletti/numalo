import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

import { DrawTrigger } from "@/app/generated/prisma/enums";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import {
  formatPrice,
  getDrawMethodLabel,
  getDrawTriggerLabel,
} from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResumeItemProps {
  label: string;
  value: string | React.ReactNode;
  span?: "col-span-1" | "col-span-full";
}

interface SectionRaffleDetailsProps {
  raffle: RaffleEntity;
}

const ResumeItem = ({ label, value, span = "col-span-1" }: ResumeItemProps) => (
  <div className={`${span} flex flex-col gap-2`}>
    <p className="font-medium">{label}</p>
    <div className="text-muted-foreground">{value}</div>
  </div>
);

const SectionRaffleDetails = ({ raffle }: SectionRaffleDetailsProps) => {
  const {
    title,
    totalNumbers,
    numberPrice,
    description,
    drawMethod,
    drawTrigger,
    drawDate,
    image,
    hasQuantityDiscount,
    quantityDiscounts,
    createdAt,
    finishedAt,
  } = raffle;

  return (
    <section id="section-raffle-details">
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem
          value="details"
          className="border-b px-4 last:border-b-0"
        >
          <AccordionTrigger className="flex items-center text-lg md:text-xl">
            Detalles de la rifa
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <ResumeItem label="Nombre de la rifa" value={title} />

            <ResumeItem
              label="Cantidad de números"
              value={`${totalNumbers} números`}
            />

            <ResumeItem
              label="Precio por número"
              value={formatPrice(numberPrice)}
            />

            {description && (
              <ResumeItem
                label="Descripción"
                value={<p className="line-clamp-3">{description}</p>}
                span="col-span-full"
              />
            )}

            {hasQuantityDiscount &&
              quantityDiscounts?.[0].quantity &&
              quantityDiscounts?.[0].percentage && (
                <ResumeItem
                  label="Descuento por cantidad"
                  value={`${quantityDiscounts?.[0].quantity} números = ${quantityDiscounts?.[0].percentage}% de descuento`}
                />
              )}

            <ResumeItem
              label="Método de sorteo"
              value={getDrawMethodLabel(drawMethod)}
            />

            <ResumeItem
              label="Cuándo se sortea"
              value={getDrawTriggerLabel(drawTrigger)}
            />

            <ResumeItem
              label="Creada el dia"
              value={format(createdAt, "dd/MM/yyyy", { locale: es })}
            />

            {finishedAt && (
              <ResumeItem
                label="Finalizo el dia"
                value={format(finishedAt, "dd/MM/yyyy", { locale: es })}
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
                      src={image}
                      alt="Preview "
                      fill
                      className="object-cover"
                    />
                  </div>
                }
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
export default SectionRaffleDetails;
