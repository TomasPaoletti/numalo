export interface UpdateCompanyDto {
  name?: string;
  image?: string | null;
  phone?: string | null;
  mpAccessToken?: string | null;
  mpRefreshToken?: string | null;
  mpTokenExpiresAt?: Date | null;
  mpUserId?: string | null;
}
