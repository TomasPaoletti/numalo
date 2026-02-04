import { RaffleStatus } from "@/app/generated/prisma/enums";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: RaffleStatus.DRAFT, label: "Borrador" },
  { value: RaffleStatus.ACTIVE, label: "Activa" },
  { value: RaffleStatus.FINISHED, label: "Finalizada" },
];

export { STATUS_OPTIONS };
