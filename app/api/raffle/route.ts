import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

import { CreateRaffleUseCase } from "@/backend/context/raffle/application/use-case/create-raffle.use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { CreateQuantityDiscountUseCase } from "@/backend/context/quantity-discount/application/use-case";
import { PrismaQuantityDiscountRepository } from "@/backend/context/quantity-discount/infrastructure/database/quantity-discount.prisma-repository";

import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await requireAuth();

    if (!companyId) {
      return NextResponse.json(
        { error: "Debes tener una compañía asociada" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const image = formData.get("image") as File | null;
    const totalNumbers = Number(formData.get("totalNumbers"));
    const numberPrice = Number(formData.get("numberPrice"));
    const hasQuantityDiscount = formData.get("hasQuantityDiscount") === "true";
    const drawMethod = formData.get("drawMethod") as DrawMethod;
    const drawTrigger = formData.get("drawTrigger") as DrawTrigger;
    const status = formData.get("status") as RaffleStatus;
    const drawDateStr = formData.get("drawDate") as string | null;
    const drawDate = drawDateStr ? new Date(drawDateStr) : undefined;

    const quantityDiscountsStr = formData.get("quantityDiscounts") as
      | string
      | null;
    const quantityDiscounts = quantityDiscountsStr
      ? JSON.parse(quantityDiscountsStr)
      : undefined;

    const raffleRepository = new PrismaRaffleRepository();
    const quantityDiscountRepository = new PrismaQuantityDiscountRepository();
    const createQuantityDiscountUseCase = new CreateQuantityDiscountUseCase(
      quantityDiscountRepository
    );
    const createRaffleUseCase = new CreateRaffleUseCase(
      raffleRepository,
      createQuantityDiscountUseCase
    );

    const raffle = await createRaffleUseCase.execute(companyId, {
      title,
      description: description || undefined,
      image: image || undefined,
      totalNumbers,
      numberPrice,
      hasQuantityDiscount,
      drawMethod,
      drawTrigger,
      drawDate,
      status,
      quantityDiscounts,
    });

    return NextResponse.json(raffle);
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

export async function GET(req: NextRequest) {
  try {
    const { companyId } = await requireAuth();

    if (!companyId) {
      return NextResponse.json(
        { error: "Debes tener una compañía asociada" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as RaffleStatus | null;

    const raffleRepository = new PrismaRaffleRepository();

    let raffles;
    if (status) {
      raffles = await raffleRepository.findByStatus(companyId, status);
    } else {
      raffles = await raffleRepository.findByCompanyId(companyId);
    }

    return NextResponse.json(raffles);
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
