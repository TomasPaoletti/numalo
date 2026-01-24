"use client";

import { FilePlus } from "lucide-react";
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

const SectionEmptyStateAdmin = () => {
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
        <Link href="/admin/create">
          <Button size="sm">Crear rifa</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
};

export default SectionEmptyStateAdmin;
