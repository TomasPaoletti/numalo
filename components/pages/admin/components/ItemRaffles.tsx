import Image from "next/image";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

interface ItemRafflesProps {
  raffles: RaffleEntity[];
}

const ItemRaffles = ({ raffles }: ItemRafflesProps) => {
  return (
    <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {raffles.map((raffle) => (
        <Item key={raffle.id} variant="outline">
          <ItemHeader>
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
              <ItemDescription>{raffle.description}</ItemDescription>
            )}
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
};

export default ItemRaffles;
