import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { CreateSchemaInput } from "@/components/pages/create/schemas/create.schema";

import { apiClient } from "@/lib/api";

const CreateRaffle = async (data: CreateSchemaInput): Promise<RaffleEntity> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("totalNumbers", (data.totalNumbers as number).toString());
  formData.append("numberPrice", (data.numberPrice as number).toString());
  formData.append("hasQuantityDiscount", data.hasQuantityDiscount.toString());
  formData.append("drawMethod", data.drawMethod);
  formData.append("drawTrigger", data.drawTrigger);
  formData.append("status", "DRAFT");

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  if (data.drawDate) {
    formData.append("drawDate", data.drawDate.toISOString());
  }

  if (data.hasQuantityDiscount && data.quantity && data.percentage) {
    const quantityDiscounts = [
      {
        quantity: data.quantity,
        percentage: data.percentage,
      },
    ];
    formData.append("quantityDiscounts", JSON.stringify(quantityDiscounts));
  }

  return apiClient.postFormData<RaffleEntity>("/api/raffle", formData);
};

export default CreateRaffle;
