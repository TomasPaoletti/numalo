"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

import CreatePaymentPreference from "@/services/payment/create-payment-preference";

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
  const router = useRouter();

  const handleAction = (action: string, raffleId: string) => {
    switch (action) {
      case "edit":
        // TODO: Implementar navegación a editar
        router.push(`/admin/raffle/${raffleId}/edit`);
        break;
      case "pay":
        handlePlay(raffleId);
        break;
      case "delete":
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar rifa:", raffleId);
        break;
      case "shared":
        const shareUrl = `${window.location.origin}/raffle/${raffleId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Enlace copiado al portapapeles");
        break;
      case "details":
        // TODO: Implementar navegación a detalles
        router.push(`/admin/raffle/${raffleId}`);
        break;
      default:
        break;
    }
  };

  const handlePlay = async (raffleId: string) => {
    try {
      toast.loading("Preparando pago");
      const { initPoint } = await CreatePaymentPreference(raffleId);
      window.location.href = initPoint;
    } catch (error: any) {
      toast.dismiss();
      console.error(error.message);
      toast.error("Error al procesar el pago");
    }
  };

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
