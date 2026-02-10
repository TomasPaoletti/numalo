import { CreateSchemaInput } from "@/components/pages/create/schemas/create.schema";

import { apiClient } from "@/lib/api";

const UpdateRaffle = async (
  raffleId: string,
  data: CreateSchemaInput,
  imagePreview: string | null
) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("totalNumbers", String(data.totalNumbers));
  formData.append("numberPrice", String(data.numberPrice));
  formData.append("hasQuantityDiscount", data.hasQuantityDiscount.toString());
  formData.append("drawMethod", data.drawMethod);
  formData.append("drawTrigger", data.drawTrigger);
  formData.append("status", "DRAFT");

  if (imagePreview) {
    formData.append("imagePreview", imagePreview);
  }

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

  return apiClient.putFormData(`/api/raffle/${raffleId}`, formData);
};

export default UpdateRaffle;
