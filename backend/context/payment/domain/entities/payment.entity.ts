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
  payerPhone?: string;
  payerInstagram?: string;
  comprobanteUrl?: string | null;
  comprobantePublicId?: string | null;
  providerMetadata?: unknown;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
