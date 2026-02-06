import { UpsertPaymentDto } from "@/backend/context/payment/application/dto";

import { PaymentEntity } from "@/backend/context/payment/domain/entities/payment.entity";
import { PaymentRepository } from "@/backend/context/payment/domain/repositories/payment.repository";

import { ValidationError } from "@/backend/shared/errors";

export class UpsertPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(dto: UpsertPaymentDto): Promise<PaymentEntity> {
    if (!dto.raffleId) {
      throw new ValidationError("raffleId es requerido");
    }

    if (!dto.providerPaymentId) {
      throw new ValidationError("providerPaymentId es requerido");
    }

    if (!dto.amount || dto.amount <= 0) {
      throw new ValidationError("amount tiene que ser mayor a 0");
    }

    return await this.paymentRepository.upsert(dto);
  }
}
