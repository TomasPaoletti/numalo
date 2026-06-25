import prisma from "@/lib/prisma";

import { Company } from "@/backend/context/company/domain/entities/company.entity";
import { CompanyRepository } from "@/backend/context/company/domain/repositories/company.repository";
import { mapCompanyToDomainEntity } from "@/backend/context/company/infrastructure/mappers/company.mapper";

export class PrismaCompanyRepository implements CompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const prismaCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!prismaCompany) return null;

    return mapCompanyToDomainEntity(prismaCompany);
  }

  async findAll(): Promise<Company[]> {
    const prismaCompanies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        users: true,
      },
    });

    return prismaCompanies.map(mapCompanyToDomainEntity);
  }

  async create(
    companyData: Omit<Company, "id" | "createdAt">,
    userId: string
  ): Promise<Company> {
    const prismaCompany = await prisma.company.create({
      data: {
        name: companyData.name,
        image: companyData.image,
        phone: companyData.phone,
        titular: companyData.titular,
        alias: companyData.alias,
        cbu: companyData.cbu,
        cuit: companyData.cuit,
        banco: companyData.banco,
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return mapCompanyToDomainEntity(prismaCompany);
  }

  async update(
    id: string,
    updateData: Partial<Omit<Company, "id" | "createdAt">>
  ): Promise<Company> {
    const prismaCompany = await prisma.company.update({
      where: { id },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.image !== undefined && { image: updateData.image }),
        ...(updateData.phone !== undefined && { phone: updateData.phone }),
        ...(updateData.titular !== undefined && { titular: updateData.titular }),
        ...(updateData.alias !== undefined && { alias: updateData.alias }),
        ...(updateData.cbu !== undefined && { cbu: updateData.cbu }),
        ...(updateData.cuit !== undefined && { cuit: updateData.cuit }),
        ...(updateData.banco !== undefined && { banco: updateData.banco }),
      },
      include: {
        users: true,
      },
    });

    return mapCompanyToDomainEntity(prismaCompany);
  }

  async delete(id: string): Promise<void> {
    await prisma.company.delete({
      where: { id },
    });
  }
}
