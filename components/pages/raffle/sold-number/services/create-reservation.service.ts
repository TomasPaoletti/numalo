import { CreateReservationDto } from "@/backend/context/sold-numbers/application/dto";

import { apiClient } from "@/lib/api";

const CreateReservation = async (data: CreateReservationDto) => {
  return apiClient.post("/api/sold-number/reservation", data);
};

export default CreateReservation;
