import { signIn } from "next-auth/react";

import { ApiError, ApiErrorWithDetails } from "@/types/api";

import { LoginSchema } from "../schema/login.schema";

const login = async (data: LoginSchema): Promise<any> => {
  const { email, password } = data;

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (!res?.ok) {
    const apiError: ApiError = {
      message: "Credenciales incorrectas",
      statusCode: res?.status || 500,
    };
    throw new ApiErrorWithDetails(apiError);
  }

  return res;
};

export { login };
