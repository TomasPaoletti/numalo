import { UpsertPaymentDto } from "@/backend/context/payment/application/dto";

import { PaymentEntity } from "@/backend/context/payment/domain/entities/payment.entity";

export interface PaymentRepository {
  upsert(data: UpsertPaymentDto): Promise<PaymentEntity>;
}
