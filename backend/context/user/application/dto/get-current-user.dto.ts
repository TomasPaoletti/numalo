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
  company?: any; // Cambiar por companyProps cuando creamos la entidad
  createdAt: Date;
  updatedAt: Date;
}
