export interface CreateCompanyDto {
  name: string;
  image?: string | null;
  phone?: string | null;
  mpAccessToken?: string | null;
  mpRefreshToken?: string | null;
  mpTokenExpiresAt?: Date | null;
  mpUserId?: string | null;
}

export interface CompanyResponseDto {
  id: string;
  name: string;
  image: string | null;
  phone: string | null;
  mpAccessToken: string | null;
  mpRefreshToken: string | null;
  mpTokenExpiresAt: Date | null;
  mpUserId: string | null;
  createdAt: Date;
}
