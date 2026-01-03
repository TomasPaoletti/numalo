import { UpdateUserData } from "@/backend/context/user/application/dto";
import { User } from "@/backend/context/user/domain/entities/user.entity";
import { UserRepository } from "@/backend/context/user/domain/repositories/user.repository";
import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateUserData): Promise<User> {
    const { id, firstName, lastName, email } = data;

    if (!id) {
      throw new ValidationError("User ID is required");
    }

    const user = await this.userRepository.findById(data.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await this.userRepository.update(user.id, {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
    });

    return updatedUser;
  }
}
