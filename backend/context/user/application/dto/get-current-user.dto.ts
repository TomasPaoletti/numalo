import { Company } from "@/backend/context/company/domain/entities/company.entity";

export interface GetCurrentUserDto {
  id: string;
}

export interface CurrentUserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId?: string | null;
  company?: Company;
  createdAt: Date;
  updatedAt: Date;
}
