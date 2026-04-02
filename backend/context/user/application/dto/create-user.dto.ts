export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fromGoogle: boolean;
}

export interface CreateUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
