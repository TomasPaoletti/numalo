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

const SectionEmptyStateAdmin = () => {
  const { data } = useSession();
  const companyId = data?.user.companyId;
  const connectMp = data?.user.mpConnected;
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
        {companyId && connectMp ? (
          <Link href="/admin/create">
            <Button size="sm">Crear rifa</Button>
          </Link>
        ) : (
          <Button size="sm" disabled>
            Crear rifa
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
};

export default SectionEmptyStateAdmin;
