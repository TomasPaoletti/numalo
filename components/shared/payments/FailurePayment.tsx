import { CircleX } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const FailurePayment = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia className="bg-red-950" variant="icon">
          <CircleX className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Fallo el pago</EmptyTitle>
        <EmptyDescription>
          Tu pago no se registro correctamente, por favor intentalo nuevamente.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
export default FailurePayment;
