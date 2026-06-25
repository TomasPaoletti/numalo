import * as z from "zod";

export const updateCompanySchema = z
  .object({
    name: z
      .string({ error: "Escribe el nombre para continuar" })
      .min(1, "Escribe el nombre para continuar"),
    phone: z.string().optional().or(z.literal("")),
    titular: z.string().min(1, "Ingresá el titular de la cuenta"),
    alias: z.string().optional().or(z.literal("")),
    cbu: z.string().optional().or(z.literal("")),
    cuit: z.string().optional().or(z.literal("")),
    banco: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !!(data.alias?.trim() || data.cbu?.trim()), {
    message: "Ingresá al menos el Alias o el CBU",
    path: ["alias"],
  });

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;
