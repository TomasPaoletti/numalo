import {
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from "@/app/generated/prisma/enums";

export interface UpsertPaymentDto {
  provider: PaymentProvider;
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentType: PaymentType;
  raffleId: string;
  payerName?: string;
  payerEmail?: string;
  providerMetadata?: unknown;
  paidAt?: Date | null;
}
