import { User } from "@/backend/context/user/domain/entities/user.entity";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(
    id: string,
    userData: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User>;
}
