import type { Prisma } from "@/app/generated/prisma/client";

export type CompanyWithRelations = Prisma.CompanyGetPayload<{
  include: {
    users: true;
  };
}>;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    company: true;
  };
}>;
