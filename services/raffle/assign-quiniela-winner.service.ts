import { apiClient } from "@/lib/api";

interface WinnerResult {
  position: number;
  quinielaNumber: number;
  mappedNumber: number;
  winnerName: string | null;
}

interface AssignQuinielaWinnerResult {
  winners: WinnerResult[];
}

export const AssignQuinielaWinner = async (
  raffleId: string,
  quinielaNumbers: number[]
): Promise<AssignQuinielaWinnerResult> => {
  return apiClient.post<AssignQuinielaWinnerResult>(
    `/api/raffle/${raffleId}/assign-quiniela-winner`,
    { quinielaNumbers }
  );
};
