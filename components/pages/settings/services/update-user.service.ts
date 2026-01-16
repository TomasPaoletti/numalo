import { UpdateUserData } from "@/backend/context/user/application/dto";
import { User } from "@/backend/context/user/domain/entities/user.entity";

import { apiClient } from "@/lib/api";

const UpdateUser = async (data: Omit<UpdateUserData, "id">): Promise<User> => {
  return apiClient.patch<User>("/api/user", data);
};
export default UpdateUser;
