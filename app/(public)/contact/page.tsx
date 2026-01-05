import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacto con Numeralo",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col gap-y-6 p-4 md:p-10">
      <h1 className="text-3xl font-semibold">Contacto</h1>

      <p className="text-muted-foreground max-w-xl">
        Si tenés consultas, dudas o necesitás soporte relacionado con el uso de
        la plataforma, podés contactarnos por correo electrónico.
      </p>

      <p>
        <span className="font-medium">Email:</span>{" "}
        <a
          href="mailto:contacto@numeralo.com"
          className="font-medium underline"
        >
          contacto@numeralo.com
        </a>
      </p>
    </div>
  );
}
