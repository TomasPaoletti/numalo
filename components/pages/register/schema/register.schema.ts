import * as z from "zod";

export const registerSchema = z.object({
  firstName: z
    .string({ error: "Escribe tu nombre para continuar" })
    .min(1, "Escribe tu nombre para continuar"),
  lastName: z
    .string({ error: "Esribe tu apellido para continuar" })
    .min(1, "Esribe tu apellido para continuar"),
  email: z.email({ error: "Escribe tu email para continuar" }),
  password: z
    .string({ error: "Escribe tu contraseña para continuar" })
    .min(4, "La contraseña debe tener minimo 4 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
