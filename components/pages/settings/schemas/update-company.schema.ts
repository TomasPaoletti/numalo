import * as z from "zod";

export const updateCompanySchema = z.object({
  name: z
    .string({ error: "Escribe el nombre para continuar" })
    .min(1, "Escribe el nombre para continuar"),
  phone: z.string().optional(),
});

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;
