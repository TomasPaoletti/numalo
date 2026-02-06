import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

const PendingPayment = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Registrando pago</EmptyTitle>
        <EmptyDescription>
          Estamos registrando su pago, por favor no cierre esta ventana.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
export default PendingPayment;
