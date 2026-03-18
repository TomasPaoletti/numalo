"use client";

import { EllipsisVerticalIcon } from "lucide-react";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

interface SoldNumbersCardsProps {
  soldNumbers: SoldNumbersEntity[];
}

const SoldNumbersCards = ({ soldNumbers }: SoldNumbersCardsProps) => {
  return (
    <section id="table-sold-numbers" className="flex flex-col gap-4 md:hidden">
      {soldNumbers.map((soldNumber) => (
        <Item key={soldNumber.id} variant="outline">
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              {soldNumber.payment?.payerName ?? "—"}
            </ItemTitle>
            <ItemDescription>
              {soldNumber.payment?.payerPhone ? (
                <a
                  href={`https://wa.me/${soldNumber.payment.payerPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {soldNumber.payment.payerPhone}
                </a>
              ) : (
                "—"
              )}
            </ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription className="bg-card rounded-sm px-2 py-1">
              {soldNumber.number}
            </ItemDescription>
          </ItemContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  {soldNumber.payment?.payerPhone ? (
                    <a
                      href={`https://wa.me/${soldNumber.payment.payerPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Whatsapp
                    </a>
                  ) : (
                    "—"
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {soldNumber.payment?.payerEmail ? (
                    <a href={`mailto:${soldNumber.payment.payerEmail}`}>
                      Email
                    </a>
                  ) : (
                    "—"
                  )}
                </DropdownMenuItem>
                {soldNumber.payment?.payerInstagram && (
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://instagram.com/${soldNumber.payment.payerInstagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Item>
      ))}
    </section>
  );
};
export default SoldNumbersCards;
