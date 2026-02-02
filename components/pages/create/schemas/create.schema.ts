import * as z from "zod";

export const createSchema = z
  .object({
    title: z.string({ error: "Escribe el titulo para continuar" }),
    totalNumbers: z.coerce
      .number({ message: "Elige la cantidad de números" })
      .min(100, "La cantidad mínima son 100 números")
      .max(1000, "La cantidad máxima son 1000 números"),
    numberPrice: z.coerce
      .number({ message: "Elige el precio por número" })
      .min(0.01, "El precio debe ser mayor a 0"),
    description: z.string().optional().nullable(),
    hasQuantityDiscount: z.boolean(),
    quantity: z.coerce
      .number({ message: "Ingresa la cantidad" })
      .min(2, "La cantidad mínima es 2")
      .optional(),
    percentage: z.coerce
      .number({ message: "Ingresa el porcentaje" })
      .min(0.01, "El porcentaje debe ser mayor a 0")
      .max(100, "El porcentaje máximo es 100")
      .optional(),
    image: z
      .instanceof(File)
      .nullable()
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "La imagen no debe superar los 5MB",
      })
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        {
          message: "Solo se permiten imágenes JPG o PNG",
        }
      ),
  })
  .superRefine((data, ctx) => {
    if (data.hasQuantityDiscount) {
      if (!data.quantity || data.quantity < 2) {
        ctx.addIssue({
          code: "custom",
          message: "La cantidad mínima es 2",
          path: ["quantity"],
        });
      }

      if (!data.percentage || data.percentage <= 0 || data.percentage > 100) {
        ctx.addIssue({
          code: "custom",
          message: "El porcentaje debe estar entre 0 y 100",
          path: ["percentage"],
        });
      }
    }
  });

export type CreateSchemaInput = z.input<typeof createSchema>;
