import { RaffleStatus } from "@/app/generated/prisma/enums";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: RaffleStatus.DRAFT, label: "Borrador" },
  { value: RaffleStatus.ACTIVE, label: "Activa" },
  { value: RaffleStatus.FINISHED, label: "Finalizada" },
];

const RAFFLES_OPTIONS = {
  [RaffleStatus.DRAFT]: [
    { value: "edit", label: "Editar" },
    { value: "pay", label: "Publicar" },
    { value: "delete", label: "Eliminar" },
  ],
  [RaffleStatus.ACTIVE]: [
    { value: "share", label: "Compartir" },
    { value: "stats", label: "Estadisticas" },
  ],
  [RaffleStatus.FINISHED]: [{ value: "stats", label: "Estadisticas" }],
};

const STATUS_BADGE: Record<RaffleStatus, { label: string; className: string }> =
  {
    [RaffleStatus.DRAFT]: {
      label: "Borrador",
      className: "bg-secondary text-secondary-foreground",
    },
    [RaffleStatus.ACTIVE]: {
      label: "Activa",
      className: "bg-primary text-primary-foreground",
    },
    [RaffleStatus.FINISHED]: {
      label: "Finalizada",
      className: "border-border text-muted-foreground",
    },
  };

export { RAFFLES_OPTIONS, STATUS_BADGE, STATUS_OPTIONS };
