import { Prisma } from "@prisma/client";

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
