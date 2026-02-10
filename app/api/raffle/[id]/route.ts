import { RaffleStatus } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

import { DrawMethod, DrawTrigger } from "@/types";

import { requireAuth } from "@/backend/shared/guards/auth.guard";

import { DeleteRaffleUseCase } from "@/backend/context/raffle/application/use-case/delete-raffle.use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import {
  CreateQuantityDiscountUseCase,
  UpdateQuantityDiscountsUseCase,
} from "@/backend/context/quantity-discount/application/use-case";
import { PrismaQuantityDiscountRepository } from "@/backend/context/quantity-discount/infrastructure/database/quantity-discount.prisma-repository";
import {
  GetRaffleByIdUseCase,
  UpdateRaffleUseCase,
} from "@/backend/context/raffle/application/use-case";
import { CustomError } from "@/backend/shared/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();

    if (!companyId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const raffleRepository = new PrismaRaffleRepository();
    const getRaffleByIdUseCase = new GetRaffleByIdUseCase(raffleRepository);

    const raffle = await getRaffleByIdUseCase.execute({
      raffleId: id,
      companyId,
    });

    return NextResponse.json(raffle);
  } catch (error: any) {
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();
    const { id } = await params;

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
    const imagePreview = formData.get("imagePreview") as string | null;

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
    const updateQuantityDiscountsUseCase = new UpdateQuantityDiscountsUseCase(
      quantityDiscountRepository,
      createQuantityDiscountUseCase
    );
    const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);

    const raffle = await updateRaffleUseCase.execute(
      id,
      companyId,
      imagePreview,
      {
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
      }
    );

    await updateQuantityDiscountsUseCase.execute(
      id,
      hasQuantityDiscount,
      quantityDiscounts
    );

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();

    if (!companyId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const raffleRepository = new PrismaRaffleRepository();
    const deleteRaffleUseCase = new DeleteRaffleUseCase(raffleRepository);

    await deleteRaffleUseCase.execute(id, companyId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
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
