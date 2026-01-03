import { NextResponse } from "next/server";

import { CreateUserUseCase } from "@/backend/context/user/application/use-case";
import { PrismaUserRepository } from "@/backend/context/user/infrastructure/database/user.prisma-repository";
import { CustomError } from "@/backend/shared/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const user = await createUserUseCase.execute(body);

    return NextResponse.json(user);
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
