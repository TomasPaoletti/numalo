import { apiClient } from "@/lib/api";

interface PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

const CreatePaymentPreference = async (
  raffleId: string
): Promise<PaymentPreferenceResponse> => {
  return apiClient.post<PaymentPreferenceResponse>(
    `/api/raffle/${raffleId}/payment`
  );
};

export default CreatePaymentPreference;
