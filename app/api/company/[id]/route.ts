import { NextResponse } from "next/server";

import { GetCompanyByIdUseCase } from "@/backend/context/company/application/use-case";
import { PrismaCompanyRepository } from "@/backend/context/company/infrastructure/database/company.prisma-repository";

import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const companyRepository = new PrismaCompanyRepository();
    const getCompanyByIdUseCase = new GetCompanyByIdUseCase(companyRepository);

    const company = await getCompanyByIdUseCase.execute({ id: params.id });

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
