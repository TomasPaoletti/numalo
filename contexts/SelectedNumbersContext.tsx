"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";
import { RaffleNumbersDto } from "@/backend/context/sold-numbers/application/dto";

interface SelectedNumbersContextType {
  selectedNumbers: number[];
  toggleNumber: (number: number) => void;
  clearSelection: () => void;
  totalPrice: number;
  finalPrice: number;
  appliedDiscount: QuantityDiscountEntity | null;
  filter: string;
  setFilter: (filter: string) => void;
  filteredNumbers: number[];
}

const SelectedNumbersContext = createContext<
  SelectedNumbersContextType | undefined
>(undefined);

export function SelectedNumbersProvider({
  children,
  raffleWithNumbers,
}: {
  children: React.ReactNode;
  raffleWithNumbers: RaffleNumbersDto;
}) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [filter, setFilter] = useState("");

  const toggleNumber = (number: number) => {
    if (raffleWithNumbers.soldNumbers.includes(number)) return;

    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
  };

  const { totalPrice, discount, finalPrice, appliedDiscount } = useMemo(() => {
    const count = selectedNumbers.length;
    const basePrice = count * raffleWithNumbers.numberPrice;

    const applicableDiscount = raffleWithNumbers.quantityDiscounts
      ?.filter((d) => count >= d.quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];

    const discountAmount = applicableDiscount
      ? (basePrice * applicableDiscount.percentage) / 100
      : 0;

    return {
      totalPrice: basePrice,
      discount: discountAmount,
      finalPrice: basePrice - discountAmount,
      appliedDiscount: applicableDiscount || null,
    };
  }, [selectedNumbers, raffleWithNumbers]);

  const allNumbers = useMemo(
    () =>
      Array.from({ length: raffleWithNumbers.totalNumbers }, (_, i) => i + 1),
    [raffleWithNumbers.totalNumbers]
  );

  const filteredNumbers = useMemo(() => {
    if (!filter) return allNumbers;
    return allNumbers.filter((num) => num.toString().includes(filter));
  }, [filter, allNumbers]);

  return (
    <SelectedNumbersContext.Provider
      value={{
        selectedNumbers,
        toggleNumber,
        clearSelection,
        totalPrice,
        finalPrice,
        appliedDiscount,
        filter,
        setFilter,
        filteredNumbers,
      }}
    >
      {children}
    </SelectedNumbersContext.Provider>
  );
}

export function useSelectedNumbers() {
  const context = useContext(SelectedNumbersContext);
  if (!context) {
    throw new Error("");
  }
  return context;
}
