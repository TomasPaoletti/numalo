export interface CreateRaffleWinnerDto {
  position: number;
  number: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  raffleId: string;
}
