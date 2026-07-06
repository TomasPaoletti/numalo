import { apiClient } from "@/lib/api";

const DeleteReservation = async (
  raffleId: string,
  sessionId: string
): Promise<void> => {
  await apiClient.delete(`/api/sold-number/reservation/${raffleId}`, {
    sessionId,
  });
};

export default DeleteReservation;
