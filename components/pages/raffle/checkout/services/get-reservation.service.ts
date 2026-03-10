import { ActiveReservation } from "@/backend/context/sold-numbers/application/dto";

import { apiClient } from "@/lib/api";

const GetActiveReservation = async (
  raffleId: string,
  sessionId: string,
  serverSide: boolean
): Promise<ActiveReservation | null> => {
  return await apiClient.get<ActiveReservation>(
    `/api/sold-number/reservation/${raffleId}`,
    { sessionId },
    { serverSide }
  );
};

export default GetActiveReservation;
