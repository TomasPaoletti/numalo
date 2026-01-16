export interface CreateCompanyDto {
  name: string;
  image?: string | null;
  phone?: string | null;
}

export interface CompanyResponseDto {
  id: string;
  name: string;
  image: string | null;
  phone: string | null;
  createdAt: Date;
}
