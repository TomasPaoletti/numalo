import prisma from "@/lib/prisma";

import { PaymentStatus } from "@/app/generated/prisma/enums";

import { UpsertPaymentDto } from "@/backend/context/payment/application/dto";

import { PaymentEntity } from "@/backend/context/payment/domain/entities/payment.entity";
import { PaymentRepository } from "@/backend/context/payment/domain/repositories/payment.repository";

import { mapPaymentToDomainEntity } from "@/backend/context/payment/infrastructure/mappers/payment.mapper";

export class PrismaPaymentRepository implements PaymentRepository {
  async upsert(data: UpsertPaymentDto): Promise<PaymentEntity> {
    const prismaPayment = await prisma.payment.upsert({
      where: {
        providerPaymentId: data.providerPaymentId,
      },
      update: {
        status: data.status,
        providerMetadata: data.providerMetadata as any,
        paidAt: data.status === PaymentStatus.APPROVED ? data.paidAt : null,
        amount: data.amount,
        currency: data.currency,
      },
      create: {
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        provider: data.provider,
        providerPaymentId: data.providerPaymentId,
        providerMetadata: data.providerMetadata as any,
        paymentType: data.paymentType,
        raffleId: data.raffleId,
        payerEmail: data.payerEmail,
        payerName: data.payerName,
        paidAt: data.status === PaymentStatus.APPROVED ? data.paidAt : null,
      },
    });

    return mapPaymentToDomainEntity(prismaPayment);
  }
}
