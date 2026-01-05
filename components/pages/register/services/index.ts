import { signIn } from "next-auth/react";

import { ApiError, ApiErrorWithDetails } from "@/types/api";

import { RegisterSchema } from "../schema/register.schema";

const register = async (data: RegisterSchema): Promise<any> => {
  const { firstName, lastName, email, password } = data;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  const response = await res.json();

  if (!response.ok) {
    const apiError: ApiError = {
      message: response.error || "Error",
      statusCode: response.status,
    };
    throw new ApiErrorWithDetails(apiError);
  }

  await signIn("credentials", {
    email: email,
    password: password,
    redirect: true,
    callbackUrl: "/admin",
  });

  return response;
};

export { register };
