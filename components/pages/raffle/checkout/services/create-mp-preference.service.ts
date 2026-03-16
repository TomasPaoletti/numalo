import { apiClient } from "@/lib/api";

interface CreatePreferenceParams {
  raffleId: string;
  numbers: number[];
  finalPrice: number;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  payerInstagram?: string;
}

interface CreatePreferenceResponse {
  initPoint: string;
  paymentId: string;
}

const CreateMpPreference = async (
  params: CreatePreferenceParams
): Promise<CreatePreferenceResponse> => {
  return apiClient.post<CreatePreferenceResponse>(
    "/api/webhooks/mercadopago/preference",
    params
  );
};

export default CreateMpPreference;
