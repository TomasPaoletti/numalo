import prisma from "@/lib/prisma";

import { User } from "@/backend/context/user/domain/entities/user.entity";
import { UserRepository } from "@/backend/context/user/domain/repositories/user.repository";
import { mapUserToDomainEntity } from "@/backend/context/user/infrastructure/mappers/user.mapper";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
      },
    });

    if (!prismaUser) return null;

    return mapUserToDomainEntity(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!prismaUser) return null;

    return mapUserToDomainEntity(prismaUser);
  }

  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyId: userData.companyId,
      },
      include: {
        company: true,
      },
    });

    return mapUserToDomainEntity(prismaUser);
  }

  async update(
    id: string,
    updateData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User> {
    const prismaUser = await prisma.user.update({
      where: { id },
      data: {
        ...(updateData.firstName && { firstName: updateData.firstName }),
        ...(updateData.lastName && { lastName: updateData.lastName }),
        ...(updateData.email && { email: updateData.email }),
        updatedAt: new Date(),
      },
      include: {
        company: true,
      },
    });

    return mapUserToDomainEntity(prismaUser);
  }
}
