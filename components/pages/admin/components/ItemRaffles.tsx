"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import { RaffleStatus } from "@/app/generated/prisma/enums";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import {
  RAFFLES_OPTIONS,
  STATUS_BADGE,
} from "@/components/pages/admin/constants";

import { useItemRaffles } from "@/components/pages/admin/hooks/use-item-raffles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ItemRafflesProps {
  raffles: RaffleEntity[];
}

const ItemRaffles = ({ raffles }: ItemRafflesProps) => {
  const router = useRouter();
  const { handleAction } = useItemRaffles();

  return (
    <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {raffles.map((raffle) => {
        const options = RAFFLES_OPTIONS[raffle.status] || [];
        const needsWinner =
          raffle.status === RaffleStatus.FINISHED && !raffle.winners?.length;

        const handleCardClick = () => {
          if (window.innerWidth >= 768) {
            router.push(`/admin/raffle/${raffle.id}/stats`);
          }
        };

        return (
          <Item
            key={raffle.id}
            variant="outline"
            onClick={handleCardClick}
            className={cn(
              "md:cursor-pointer",
              needsWinner && "border-amber-300 dark:border-amber-700"
            )}
          >
            <ItemHeader className="hidden md:flex">
              <div className="relative w-full">
                {raffle.image ? (
                  <Image
                    src={raffle.image}
                    alt={raffle.title}
                    width={128}
                    height={128}
                    loading="eager"
                    className="aspect-square size-32 w-full rounded-sm object-cover"
                  />
                ) : (
                  <div className="from-secondary to-border aspect-square size-32 w-full rounded-sm bg-linear-to-br" />
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "absolute top-2 left-2",
                    STATUS_BADGE[raffle.status].className
                  )}
                >
                  {STATUS_BADGE[raffle.status].label}
                </Badge>
              </div>
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{raffle.title}</ItemTitle>
              <Badge
                variant="outline"
                className={cn(
                  "md:hidden",
                  STATUS_BADGE[raffle.status].className
                )}
              >
                {STATUS_BADGE[raffle.status].label}
              </Badge>
              {raffle.description && (
                <ItemDescription className="line-clamp-1 md:line-clamp-2">
                  {raffle.description}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
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
