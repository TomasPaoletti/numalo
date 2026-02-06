import {
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from "@/app/generated/prisma/enums";

export interface PaymentEntity {
  id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerPaymentId: string;
  paymentType: PaymentType;
  raffleId: string;
  payerName?: string;
  payerEmail?: string;
  providerMetadata?: unknown;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
