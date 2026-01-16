import {
  CurrentUserResponseDto,
  GetCurrentUserDto,
} from "@/backend/context/user/application/dto";

import { UserRepository } from "@/backend/context/user/domain/repositories/user.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: GetCurrentUserDto): Promise<CurrentUserResponseDto> {
    const { id } = data;

    if (!id) {
      throw new ValidationError("El ID del usuario es requerido");
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User no encontrado");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyId: user.companyId,
      company: user.company
        ? {
            id: user.company.id,
            name: user.company.name,
            image: user.company.image,
            phone: user.company.phone,
            createdAt: user.company.createdAt,
          }
        : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
