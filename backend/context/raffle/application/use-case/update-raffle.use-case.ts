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
    companyId: string,
    imagePreview: string | null,
    data: UpdateRaffleDto
  ): Promise<RaffleEntity> {
    const {
      title,
      description,
      image,
      totalNumbers,
      numberPrice,
      hasQuantityDiscount,
      drawMethod,
      drawTrigger,
      drawDate,
      status,
      quantityDiscounts,
    } = data;

    if (!raffleId) {
      throw new ValidationError("El id de la rifa es obligatorio");
    }
    const existingRaffle = await this.raffleRepository.findById(raffleId);

    if (!existingRaffle) {
      throw new NotFoundError("Rifa no encontrada");
    }

    if (!title) {
      throw new ValidationError("El título es requerido");
    }

    if (totalNumbers && totalNumbers < 100) {
      throw new ValidationError("La cantidad mínima de números es 100");
    }

    if (numberPrice && numberPrice <= 0) {
      throw new ValidationError("El precio debe ser mayor a 0");
    }

    if (drawTrigger === "FECHA_FIJA" && !drawDate) {
      throw new ValidationError("Debes seleccionar una fecha para el sorteo");
    }

    if (hasQuantityDiscount && quantityDiscounts) {
      for (const discount of quantityDiscounts) {
        if (discount.quantity < 2) {
          throw new ValidationError("La cantidad mínima para descuento es 2");
        }
        if (discount.percentage <= 0 || discount.percentage > 100) {
          throw new ValidationError("El porcentaje debe estar entre 0 y 100");
        }
      }
    }

    let imageUrl: string | null = existingRaffle.image;
    let imagePublicId: string | null = existingRaffle.imagePublicId;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedImage = await uploadImage(buffer, {
        folder: `raffle/${companyId}`,
        publicId: image.name.replace(/\.[^/.]+$/, ""),
      });

      imageUrl = uploadedImage.url;
      imagePublicId = uploadedImage.publicId;
    }

    if (!imagePreview && existingRaffle.imagePublicId) {
      await deleteImage(existingRaffle.imagePublicId);
      imageUrl = null;
      imagePublicId = null;
    }

    if (imagePreview !== existingRaffle.image && existingRaffle.imagePublicId) {
      await deleteImage(existingRaffle.imagePublicId);
    }

    const raffleData = {
      title,
      description: description || "",
      image: imageUrl,
      imagePublicId,
      totalNumbers,
      numberPrice,
      hasQuantityDiscount,
      drawMethod,
      drawTrigger,
      drawDate: drawDate || null,
      status,
      winnerNumber: null,
      winnerName: null,
      winnerPhone: null,
      winnerEmail: null,
      drawnAt: null,
      publishedAt: null,
      finishedAt: null,
      companyId,
    };

    const updatedRaffle = await this.raffleRepository.update(
      raffleId,
      raffleData
    );

    return updatedRaffle;
  }
}
