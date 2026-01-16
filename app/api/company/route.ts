import { NextResponse } from "next/server";

import { UpsertCompanyUseCase } from "@/backend/context/company/application/use-case/upsert-company.use-case";
import { PrismaCompanyRepository } from "@/backend/context/company/infrastructure/database/company.prisma-repository";
import { PrismaUserRepository } from "@/backend/context/user/infrastructure/database/user.prisma-repository";

import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function PUT(req: Request) {
  try {
    const { userId } = await requireAuth();

    const body = await req.json();

    const companyRepository = new PrismaCompanyRepository();
    const userRepository = new PrismaUserRepository();
    const upsertCompanyUseCase = new UpsertCompanyUseCase(
      companyRepository,
      userRepository
    );

    const company = await upsertCompanyUseCase.execute(userId, body);

    return NextResponse.json(company);
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
