import * as z from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string({ error: "Escribe tu nombre para continuar" })
    .min(1, "Escribe tu nombre para continuar"),
  lastName: z
    .string({ error: "Esribe tu apellido para continuar" })
    .min(1, "Esribe tu apellido para continuar"),
  email: z.email({ error: "Escribe tu email para continuar" }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
