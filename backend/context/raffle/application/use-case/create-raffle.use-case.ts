import { CreateRaffleDto } from "@/backend/context/raffle/application/dto";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";
import { RaffleRepository } from "@/backend/context/raffle/domain/repositories/raffle.repository";

import { CreateQuantityDiscountUseCase } from "@/backend/context/quantity-discount/application/use-case";

import { ValidationError } from "@/backend/shared/errors";

import { uploadImage } from "@/backend/shared/cloudinary/cloudinary-uploader";

export class CreateRaffleUseCase {
  constructor(
    private raffleRepository: RaffleRepository,
    private createQuantityDiscountUseCase: CreateQuantityDiscountUseCase
  ) {}

  async execute(
    companyId: string,
    data: CreateRaffleDto
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

    if (!title) {
      throw new ValidationError("El título es requerido");
    }

    if (totalNumbers < 100) {
      throw new ValidationError("La cantidad mínima de números es 100");
    }

    if (numberPrice <= 0) {
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

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

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

    const raffle = await this.raffleRepository.create(raffleData);

    const createdDiscounts = [];
    if (
      hasQuantityDiscount &&
      quantityDiscounts &&
      quantityDiscounts.length > 0
    ) {
      for (const discount of quantityDiscounts) {
        const createdDiscount =
          await this.createQuantityDiscountUseCase.execute({
            quantity: discount.quantity,
            percentage: discount.percentage,
            raffleId: raffle.id,
          });
        createdDiscounts.push(createdDiscount);
      }
    }

    return raffle;
  }
}
