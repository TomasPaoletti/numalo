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
    { value: "details", label: "Ver detalles" },
  ],
  [RaffleStatus.FINISHED]: [{ value: "stats", label: "Estadisticas" }],
};

export { RAFFLES_OPTIONS, STATUS_OPTIONS };
