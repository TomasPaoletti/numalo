import bcrypt from "bcryptjs";

import {
  CreateUserDto,
  CreateUserResponseDto,
} from "@/backend/context/user/application/dto";
import { UserRepository } from "@/backend/context/user/domain/repositories/user.repository";
import { ConflictError, ValidationError } from "@/backend/shared/errors";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<CreateUserResponseDto> {
    const { firstName, lastName, email, password } = data;

    if (!email || !password || !firstName || !lastName) {
      throw new ValidationError("Faltan campos");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Este email ya esta en uso");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
