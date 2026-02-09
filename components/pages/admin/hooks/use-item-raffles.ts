import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRevalidate } from "@/app/hooks/use-revalidate";

import { CallPaymentPreference } from "@/lib/payment";

import { DeleteRaffle } from "@/services/raffle";

export function useItemRaffles() {
  const router = useRouter();
  const { revalidateTag } = useRevalidate();

  const handleAction = (action: string, raffleId: string) => {
    switch (action) {
      case "edit":
        // TODO: Implementar navegación a editar
        router.push(`/admin/raffle/${raffleId}/edit`);
        break;
      case "pay":
        handlePay(raffleId);
        break;
      case "delete":
        handleDelete(raffleId);
        break;
      case "share":
        const shareUrl = `${window.location.origin}/raffle/${raffleId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Enlace copiado al portapapeles");
        break;
      case "details":
        router.push(`/admin/raffle/${raffleId}/stats`);
        break;
      default:
        break;
    }
  };

  const handlePay = async (raffleId: string) => {
    try {
      toast.loading("Preparando pago");
      await CallPaymentPreference(raffleId);
    } catch (error: any) {
      toast.dismiss();
      toast.error("Error al procesar el pago");
    }
  };

  const handleDelete = async (raffleId: string) => {
    try {
      toast.loading("Eliminando riffa");
      await DeleteRaffle(raffleId);
      revalidateTag("raffles");
      toast.dismiss();
      toast.success("Rifa eliminada");
    } catch (error: any) {
      toast.dismiss();
      console.error(error);
      toast.error(error.message);
    }
  };

  return { handleAction };
}
