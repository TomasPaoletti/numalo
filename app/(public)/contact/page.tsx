import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con el equipo de Numeralo para consultas sobre la plataforma de rifas online.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col gap-y-6 p-6 md:py-12">
      <h1 className="text-3xl font-semibold">Contacto</h1>

      <p className="text-muted-foreground max-w-xl">
        Si tenés consultas, dudas o necesitás soporte relacionado con el uso de
        la plataforma, podés contactarnos por correo electrónico.
      </p>

      <p>
        <span className="font-medium">Email:</span>{" "}
        <a
          href="mailto:contacto@numeraloapp.com"
          className="font-medium underline"
        >
          contacto@numeraloapp.com
        </a>
      </p>
    </div>
  );
}
