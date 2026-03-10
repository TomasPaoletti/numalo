import { ShoppingBag } from "lucide-react";

import { formatPrice } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckoutSummaryProps {
  numbers: number[];
  finalPrice: number;
}

const CheckoutSummary = ({ numbers, finalPrice }: CheckoutSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-x-2 text-lg md:text-xl">
          <ShoppingBag size={18} className="text-primary" /> Resumen de compra
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-y-1">
          <p className="md:text-lg">Números selecionados</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(25px,25px))] gap-1">
            {numbers.map((number) => {
              return (
                <div
                  key={number}
                  className="bg-primary text-primary-foreground border-primary flex aspect-square items-center justify-center rounded-full border-2 text-xs font-medium lg:text-sm"
                >
                  {number}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="md:text-lg">Total a pagar</p>
          <p className="text-primary text-3xl">{formatPrice(finalPrice)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
export default CheckoutSummary;
