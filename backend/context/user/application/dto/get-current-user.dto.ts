import { CompanyProps } from "@/backend/context/company/domain/entities/company.entity";

export interface GetCurrentUserDto {
  id: string;
}

export interface CurrentUserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string | null;
  companyId?: string | null;
  company?: CompanyProps;
  createdAt: Date;
  updatedAt: Date;
}
