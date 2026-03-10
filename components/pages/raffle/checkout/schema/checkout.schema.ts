import * as z from "zod";

export const checkoutSchema = z.object({
  name: z
    .string({ error: "Escribe el nombre para continuar" })
    .min(1, "Escribe el nombre para continuar"),
  email: z.email({ error: "Escriba el email para continuar" }),
  phone: z
    .string({ error: "Escribe el número para continuar" })
    .min(1, "Escribe el número para continuar"),
  instagram: z.string().optional(),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
