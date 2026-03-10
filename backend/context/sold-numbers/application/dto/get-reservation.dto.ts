export interface GetReservationDto {
  raffleId: string;
  sessionId: string;
}

export interface ActiveReservation {
  numbers: number[];
  reservedUntil: string;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  raffleId: string;
}
