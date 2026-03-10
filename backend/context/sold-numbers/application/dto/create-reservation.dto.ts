export interface CreateReservationDto {
  raffleId: string;
  numbers: number[];
  sessionId: string;
  reservedUntil?: Date;
}
