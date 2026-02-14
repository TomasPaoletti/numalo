"use client";

import { Button } from "@/components/ui/button";
import { useSelectedNumbers } from "@/contexts/SelectedNumbersContext";

const SoldNumberFooter = () => {
  const { selectedNumbers, totalPrice, finalPrice, appliedDiscount } =
    useSelectedNumbers();

  if (selectedNumbers.length === 0) return null;

  return (
    <section
      id="sold-number-footer"
      className="bg-background fixed right-0 bottom-0 left-0 border-t px-4 py-2"
    >
      <div className="mx-auto flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {selectedNumbers.length} número
            {selectedNumbers.length > 1 ? "s" : ""} seleccionado
            {selectedNumbers.length > 1 ? "s" : ""}
          </p>

          {appliedDiscount ? (
            <>
              <p className="text-muted-foreground text-sm line-through">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-primary text-lg font-semibold">
                ${finalPrice.toFixed(2)}
                <span className="ml-2 text-sm font-normal">
                  ({appliedDiscount.percentage}% off)
                </span>
              </p>
            </>
          ) : (
            <p className="text-lg font-semibold">
              Total: ${finalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <Button size="lg">Continuar</Button>
      </div>
    </section>
  );
};

export default SoldNumberFooter;
