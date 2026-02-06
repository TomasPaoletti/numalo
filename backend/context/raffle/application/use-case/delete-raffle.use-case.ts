import { RaffleStatus } from "@/app/generated/prisma/enums";

import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";

import { deleteImage } from "@/backend/shared/cloudinary/cloudinary-deleter";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";
import {
  ConflictError,
  ForbiddenError,
} from "@/backend/shared/errors/custom-error";

export class DeleteRaffleUseCase {
  constructor(private raffleRepository: RaffleRepository) {}

  async execute(raffleId: string, companyId: string): Promise<void> {
    if (!raffleId) {
      throw new ValidationError("El id de la rifa es obligatorio");
    }

    const existingRaffle = await this.raffleRepository.findById(raffleId);

    if (!existingRaffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    if (existingRaffle.companyId !== companyId) {
      throw new ForbiddenError("No tienes permisos para eliminar esta rifa");
    }

    if (existingRaffle.status === RaffleStatus.ACTIVE) {
      throw new ConflictError("No se puede eliminar una rifa que esta activa");
    }

    if (existingRaffle.imagePublicId) {
      try {
        await deleteImage(existingRaffle.imagePublicId);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    return await this.raffleRepository.delete(raffleId);
  }
}
