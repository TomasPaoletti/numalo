import { User } from "@/backend/context/user/domain/entities/user.entity";
import { UserWithRelations } from "@/backend/shared/types/prisma-with-relations";

export function mapUserToDomainEntity(prismaUser: UserWithRelations): User {
  return User.create(
    prismaUser.id,
    prismaUser.email,
    prismaUser.firstName,
    prismaUser.lastName,
    prismaUser.createdAt,
    prismaUser.updatedAt,
    prismaUser.password,
    prismaUser.companyId,
    prismaUser.company
  );
}
