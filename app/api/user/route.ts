import { NextResponse } from "next/server";

import { PrismaUserRepository } from "@/backend/context/user/infrastructure/database/user.prisma-repository";

import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function GET() {
  try {
    const { userId } = await requireAuth();

    const userRepository = new PrismaUserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyId: user.companyId,
      company: user.company,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await requireAuth();

    const body = await req.json();
    const { firstName, lastName, email } = body;

    const userRepository = new PrismaUserRepository();

    const updatedUser = await userRepository.update(userId, {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      companyId: updatedUser.companyId,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
