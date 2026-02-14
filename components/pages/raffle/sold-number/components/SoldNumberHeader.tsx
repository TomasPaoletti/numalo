"use client";

import { ShoppingCart, Ticket } from "lucide-react";

import { useSelectedNumbers } from "@/contexts/SelectedNumbersContext";

interface SoldNumberHeaderProps {
  title: string;
  totalNumbers: number;
  soldNumbers: number[];
}

const SoldNumberHeader = ({
  title,
  totalNumbers,
  soldNumbers,
}: SoldNumberHeaderProps) => {
  const { selectedNumbers } = useSelectedNumbers();

  const selectedNumbersLength = selectedNumbers.length;
  const availableNumbers = totalNumbers - soldNumbers.length;

  return (
    <section
      id="sold-number-header"
      className="bg-accent mb-6 flex w-full items-center justify-between gap-x-4 rounded-lg px-4 py-2 md:mb-10"
    >
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <Ticket
            size={26}
            className="bg-primary/20 text-primary rounded-full p-1"
          />
          <h1 className="text-semibold text-lg md:text-xl">{title}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Números disponibles:{" "}
          <span className="text-primary">{availableNumbers}</span>
        </p>
      </div>
      <div className="relative">
        <ShoppingCart />
        {selectedNumbersLength > 0 && (
          <div className="bg-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full">
            <p className="text-primary-foreground text-[10px] leading-none">
              {selectedNumbersLength}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SoldNumberHeader;
