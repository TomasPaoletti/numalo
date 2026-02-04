import { getServerSession } from "next-auth";
import { headers } from "next/headers";

import { authOptions } from "@/lib/auth";

import { UnauthorizedError } from "@/backend/shared/errors/custom-error";

export async function requireAuth() {
  let session = await getServerSession(authOptions);

  if (!session) {
    const headersList = await headers();
    const cookie = headersList.get("cookie");

    if (cookie) {
      session = await getServerSession(authOptions);
    }
  }

  if (!session || !session.user) {
    throw new UnauthorizedError("No autenticado");
  }

  return {
    userId: session.user.id,
    email: session.user.email!,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    companyId: session.user.companyId,
  };
}
