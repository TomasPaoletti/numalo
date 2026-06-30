import { Company } from "@/backend/context/company/domain/entities/company.entity";

import { CompanyWithRelations } from "@/backend/shared/types/prisma-with-relations";

export function mapCompanyToDomainEntity(
  prismaCompany: CompanyWithRelations
): Company {
  return {
    id: prismaCompany.id,
    name: prismaCompany.name,
    image: prismaCompany.image,
    phone: prismaCompany.phone,
    titular: prismaCompany.titular,
    alias: prismaCompany.alias,
    cbu: prismaCompany.cbu,
    cuit: prismaCompany.cuit,
    banco: prismaCompany.banco,
    canCreateFreeRaffle: prismaCompany.canCreateFreeRaffle,
    createdAt: prismaCompany.createdAt,
  };
}
