import { redirect } from "next/navigation";

import { RaffleStatus } from "@/app/generated/prisma/enums";

import { GetRaffleById } from "@/services/raffle/get-raffle-by-id.service";

import { EditContextProvider } from "@/contexts/EditContext";

import SectionFormEdit from "@/components/pages/raffle/edit/components/SectionFormEdit";
import SectionHeaderEdit from "@/components/pages/raffle/edit/components/SectionHeaderEdit";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raffle = await GetRaffleById(id, true);

  if (!raffle || raffle.status !== RaffleStatus.DRAFT) {
    redirect("/admin");
  }

  return (
    <EditContextProvider raffle={raffle}>
      <SectionHeaderEdit />
      <SectionFormEdit />
    </EditContextProvider>
  );
}
