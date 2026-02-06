"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { RAFFLES_OPTIONS } from "@/components/pages/admin/constants";

import { useItemRaffles } from "@/components/pages/admin/hooks/use-item-raffles";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemRafflesProps {
  raffles: RaffleEntity[];
}

const ItemRaffles = ({ raffles }: ItemRafflesProps) => {
  const { handleAction } = useItemRaffles();

  return (
    <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {raffles.map((raffle) => {
        const options = RAFFLES_OPTIONS[raffle.status] || [];

        return (
          <Item key={raffle.id} variant="outline">
            <ItemHeader className="hidden md:flex">
              {raffle.image ? (
                <Image
                  src={raffle.image}
                  alt={raffle.title}
                  width={128}
                  height={128}
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="from-secondary to-border aspect-square size-32 w-full rounded-sm bg-linear-to-br" />
              )}
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{raffle.title}</ItemTitle>
              {raffle.description && (
                <ItemDescription className="line-clamp-1 md:line-clamp-2">
                  {raffle.description}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    {options.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleAction(option.value, raffle.id)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        );
      })}
    </ItemGroup>
  );
};

export default ItemRaffles;
