"use client";

import { RaffleNumbersDto } from "@/backend/context/sold-numbers/application/dto";

import { useSelectedNumbers } from "@/contexts/SelectedNumbersContext";

import { cn } from "@/lib/utils";

interface SoldNumberSelectorProps {
  raffleWithNumbers: RaffleNumbersDto;
}

const SoldNumberSelector = ({ raffleWithNumbers }: SoldNumberSelectorProps) => {
  const { selectedNumbers, toggleNumber, filteredNumbers } =
    useSelectedNumbers();

  const { soldNumbers } = raffleWithNumbers;

  if (filteredNumbers.length === 0) {
    return <p className="py-8 text-center">No se encontraron números</p>;
  }

  return (
    <section
      id="sold-number-selector"
      className="grid grid-cols-10 gap-2 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-24"
    >
      {filteredNumbers.map((number) => {
        const isSold = soldNumbers.includes(number);
        const isSelected = selectedNumbers.includes(number);

        return (
          <button
            key={number}
            onClick={() => toggleNumber(number)}
            disabled={isSold}
            className={cn(
              "aspect-square rounded-full border-2 transition-all",
              "flex items-center justify-center text-xs font-medium lg:text-sm",
              isSold && "bg-muted cursor-not-allowed opacity-40",
              !isSold && !isSelected && "border-border hover:border-primary/50",
              isSelected && "bg-primary text-primary-foreground border-primary"
            )}
          >
            {number}
          </button>
        );
      })}
    </section>
  );
};

export default SoldNumberSelector;
