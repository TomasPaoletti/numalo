"use client";

interface SoldNumbersWinnerDataProps {
  winnerNumber: number | null;
  winnerName: string | null;
}

const SoldNumbersWinnerData = ({
  winnerNumber,
  winnerName,
}: SoldNumbersWinnerDataProps) => {
  return (
    <div className="hidden flex-col gap-4 md:flex md:flex-row md:gap-6">
      <div className="bg-primary/10 rounded-sm p-4">
        <p>
          Numero ganador: <span className="text-primary">{winnerNumber}</span>
        </p>
      </div>
      <div className="bg-primary/10 rounded-sm p-4">
        <p>
          Nombre del ganador: <span className="text-primary">{winnerName}</span>
        </p>
      </div>
    </div>
  );
};
export default SoldNumbersWinnerData;
