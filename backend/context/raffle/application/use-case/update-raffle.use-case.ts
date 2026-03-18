import { UpdateRaffleDto } from "@/backend/context/raffle/application/dto";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";
import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";
import { deleteImage } from "@/backend/shared/cloudinary/cloudinary-deleter";
import { uploadImage } from "@/backend/shared/cloudinary/cloudinary-uploader";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class UpdateRaffleUseCase {
  constructor(private raffleRepository: RaffleRepository) {}

  async execute(
    raffleId: string,
    data: UpdateRaffleDto,
    companyId?: string,
    imagePreview?: string | null
  ): Promise<RaffleEntity> {
    if (!raffleId) {
      throw new ValidationError("El id de la rifa es obligatorio");
    }

    const existingRaffle = await this.raffleRepository.findById(raffleId);

    if (!existingRaffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    if (data.hasQuantityDiscount && data.quantityDiscounts) {
      for (const discount of data.quantityDiscounts) {
        if (discount.quantity < 2) {
          throw new ValidationError("La cantidad mínima para descuento es 2");
        }
        if (discount.percentage <= 0 || discount.percentage > 100) {
          throw new ValidationError("El porcentaje debe estar entre 0 y 100");
        }
      }
    }

    let imageUrl: string | undefined = undefined;
    let imagePublicId: string | undefined = undefined;

    if (data.image) {
      const arrayBuffer = await data.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedImage = await uploadImage(buffer, {
        folder: `raffle/${companyId}`,
        publicId: data.image.name.replace(/\.[^/.]+$/, ""),
      });

      imageUrl = uploadedImage.url;
      imagePublicId = uploadedImage.publicId;
    } else if (imagePreview === null && existingRaffle.imagePublicId) {
      await deleteImage(existingRaffle.imagePublicId);
      imageUrl = null as any;
      imagePublicId = null as any;
    } else if (
      imagePreview !== undefined &&
      imagePreview !== existingRaffle.image &&
      existingRaffle.imagePublicId
    ) {
      await deleteImage(existingRaffle.imagePublicId);
    }

    const raffleData: Partial<Omit<RaffleEntity, "id" | "createdAt">> = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(imageUrl !== undefined && { image: imageUrl }),
      ...(imagePublicId !== undefined && { imagePublicId }),
      ...(data.totalNumbers !== undefined && {
        totalNumbers: data.totalNumbers,
      }),
      ...(data.numberPrice !== undefined && { numberPrice: data.numberPrice }),
      ...(data.hasQuantityDiscount !== undefined && {
        hasQuantityDiscount: data.hasQuantityDiscount,
      }),
      ...(data.drawMethod !== undefined && {
        drawMethod: data.drawMethod as any,
      }),
      ...(data.drawTrigger !== undefined && {
        drawTrigger: data.drawTrigger as any,
      }),
      ...(data.drawDate !== undefined && { drawDate: data.drawDate }),
      ...(data.status !== undefined && { status: data.status as any }),
      ...(data.winnerNumber !== undefined && {
        winnerNumber: data.winnerNumber,
      }),
      ...(data.winnerName !== undefined && { winnerName: data.winnerName }),
      ...(data.winnerPhone !== undefined && { winnerPhone: data.winnerPhone }),
      ...(data.winnerEmail !== undefined && { winnerEmail: data.winnerEmail }),
      ...(data.drawnAt !== undefined && { drawnAt: data.drawnAt }),
      ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt }),
      ...(data.finishedAt !== undefined && { finishedAt: data.finishedAt }),
    };

    const updatedRaffle = await this.raffleRepository.update(
      raffleId,
      raffleData
    );

    return updatedRaffle;
  }
}
