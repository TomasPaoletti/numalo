import { Payment } from "@/app/generated/prisma/client";

import { PaymentEntity } from "@/backend/context/payment/domain/entities/payment.entity";

export function mapPaymentToDomainEntity(
  prismaPayment: Payment
): PaymentEntity {
  return {
    id: prismaPayment.id,
    amount: Number(prismaPayment.amount),
    currency: prismaPayment.currency,
    status: prismaPayment.status,
    provider: prismaPayment.provider,
    providerPaymentId: prismaPayment.providerPaymentId!,
    paymentType: prismaPayment.paymentType,
    raffleId: prismaPayment.raffleId ?? undefined,
    payerName: prismaPayment.payerName ?? undefined,
    payerEmail: prismaPayment.payerEmail ?? undefined,
    providerMetadata: prismaPayment.providerMetadata,
    paidAt: prismaPayment.paidAt ?? null,
    createdAt: prismaPayment.createdAt,
    updatedAt: prismaPayment.updatedAt,
  };
}
