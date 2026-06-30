"use client";

import { RaffleWinnerEntity } from "@/backend/context/raffle-winner/domain/entities/raffle-winner.entity";

interface SoldNumbersWinnerDataProps {
  winners: RaffleWinnerEntity[];
}

const SoldNumbersWinnerData = ({ winners }: SoldNumbersWinnerDataProps) => {
  if (winners.length === 0) return null;

  return (
    <div className="hidden flex-col gap-4 md:flex md:flex-row md:flex-wrap md:gap-6">
      {winners.map((winner) => (
        <div key={winner.id} className="bg-primary/10 rounded-sm p-4">
          <p className="font-medium">
            {winners.length > 1 ? `${winner.position}° ganador` : "Ganador"}
          </p>
          <p>
            Número: <span className="text-primary">{winner.number}</span>
          </p>
          {winner.name && (
            <p>
              Nombre: <span className="text-primary">{winner.name}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
export default SoldNumbersWinnerData;
