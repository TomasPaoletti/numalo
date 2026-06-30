export interface CreateCompanyDto {
  name: string;
  image?: string | null;
  phone?: string | null;
  titular?: string | null;
  alias?: string | null;
  cbu?: string | null;
  cuit?: string | null;
  banco?: string | null;
  canCreateFreeRaffle?: boolean;
}

export interface CompanyResponseDto {
  id: string;
  name: string;
  image: string | null;
  phone: string | null;
  titular: string | null;
  alias: string | null;
  cbu: string | null;
  cuit: string | null;
  banco: string | null;
  canCreateFreeRaffle: boolean;
  createdAt: Date;
}
