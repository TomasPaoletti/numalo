import { DrawMethod, DrawTrigger } from "@/types";
import * as z from "zod";

export const createSchema = z
  .object({
    title: z
      .string({ error: "Escribe el titulo para continuar" })
      .min(1, "Escribe el titulo para continuar"),
    totalNumbers: z.coerce
      .number({ error: "Elige la cantidad de números" })
      .min(100, "La cantidad mínima son 100 números")
      .max(1000, "La cantidad máxima son 1000 números"),
    numberPrice: z.coerce
      .number({ error: "Elige el precio por número" })
      .min(0.01, "El precio debe ser mayor a 0"),
    description: z.string().optional().nullable(),
    hasQuantityDiscount: z.boolean(),
    quantity: z.coerce
      .number({ error: "Ingresa la cantidad" })
      .min(2, "La cantidad mínima es 2")
      .optional(),
    percentage: z.coerce
      .number({ error: "Ingresa el porcentaje" })
      .min(0.01, "El porcentaje debe ser mayor a 0")
      .max(100, "El porcentaje máximo es 100")
      .optional(),
    image: z
      .instanceof(File)
      .nullable()
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        error: "La imagen no debe superar los 5MB",
      })
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        {
          error: "Solo se permiten imágenes JPG o PNG",
        }
      ),
    drawMethod: z.enum(DrawMethod, { error: "Selecciona un método de sorteo" }),
    drawTrigger: z.enum(DrawTrigger, {
      error: "Selecciona cúando se realizará el sorteo",
    }),
    drawDate: z.date().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.hasQuantityDiscount) {
      if (!data.quantity || data.quantity < 2) {
        ctx.addIssue({
          code: "custom",
          error: "La cantidad mínima es 2",
          path: ["quantity"],
        });
      }

      if (!data.percentage || data.percentage <= 0 || data.percentage > 100) {
        ctx.addIssue({
          code: "custom",
          error: "El porcentaje debe estar entre 0 y 100",
          path: ["percentage"],
        });
      }
    }

    if (data.drawTrigger === DrawTrigger.FECHA_FIJA && !data.drawDate) {
      ctx.addIssue({
        code: "custom",
        message: "Debes seleccionar una fecha y hora",
        path: ["drawDate"],
      });
    }

    if (data.drawDate && data.drawDate < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha debe ser futura",
        path: ["drawDate"],
      });
    }
  });

export type CreateSchemaInput = z.input<typeof createSchema>;
