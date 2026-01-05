import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Escribe tu email para continuar" }),
  password: z
    .string({ error: "Escribe tu contraseña para continuar" })
    .min(1, "Escribe tu contraseña para continuar"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
