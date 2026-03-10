import { apiClient } from "@/lib/api";

export const DeleteReservationNumberBySession = async (
  raffleId: string,
  sessionId: string
) => {
  return apiClient.delete<void>(`/api/sold-number/reservation/${raffleId}`, {
    sessionId,
  });
};
