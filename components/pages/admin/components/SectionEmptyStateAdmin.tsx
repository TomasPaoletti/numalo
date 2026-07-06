"use client";

import { FilePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SectionEmptyStateAdmin = () => {
  const { data } = useSession();
  const companyId = data?.user.companyId;
  const hasBankDetails = data?.user.hasBankDetails;
  const canCreateRaffle = !!companyId && !!hasBankDetails;

  const disabledReason = !companyId
    ? "Primero registrá tu compañía en Ajustes para poder crear rifas."
    : "Agregá un alias o CBU en Ajustes para poder crear rifas.";

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FilePlus />
        </EmptyMedia>
        <EmptyTitle>Todavia no tienes ninguna rifa</EmptyTitle>
        <EmptyDescription>
          No has creado ninguna rifa todavia. Empieza creando una y veras las
          estadisticas aqui
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {canCreateRaffle ? (
          <Link href="/admin/create">
            <Button size="sm">Crear rifa</Button>
          </Link>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" disabled className="pointer-events-none">
                  Crear rifa
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>{disabledReason}</TooltipContent>
          </Tooltip>
        )}
      </EmptyContent>
    </Empty>
  );
};

export default SectionEmptyStateAdmin;
