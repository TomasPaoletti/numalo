import bcrypt from "bcryptjs";

import {
  CreateUserDto,
  CreateUserResponseDto,
} from "@/backend/context/user/application/dto";
import { UserRepository } from "@/backend/context/user/domain/repositories/user.repository";
import { emailSendWelcome } from "@/backend/shared/emails/email-send-welcome.email";
import { resendAddContact } from "@/backend/shared/emails/resend-add-contact";
import { ConflictError, ValidationError } from "@/backend/shared/errors";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<CreateUserResponseDto> {
    const { firstName, lastName, email, password, fromGoogle } = data;

    if (!email || !firstName || !lastName) {
      throw new ValidationError("Faltan campos");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Este email ya esta en uso");
    }

    if (!fromGoogle && !password) {
      throw new ValidationError("No es de google y no tiene contraseña");
    }

    const hashedPassword = fromGoogle ? null : await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await emailSendWelcome({ email, firstName, lastName });
    resendAddContact({ email, firstName, lastName });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
