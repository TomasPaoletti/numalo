import { CircleCheck } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const SuccessPayment = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia className="bg-green-950" variant="icon">
          <CircleCheck className="text-green-500" />
        </EmptyMedia>
        <EmptyTitle>Pago registrado</EmptyTitle>
        <EmptyDescription>Se registro correctamente tu pago.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
export default SuccessPayment;
