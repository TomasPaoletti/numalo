import { CurrentUserResponseDto } from "@/backend/context/user/application/dto";

import { apiClient } from "@/lib/api";

const CurrentUser = async (
  serverSide: boolean
): Promise<CurrentUserResponseDto> => {
  return apiClient.get<CurrentUserResponseDto>("/api/user", undefined, {
    tags: ["current-user"],
    serverSide,
  });
};

export default CurrentUser;
