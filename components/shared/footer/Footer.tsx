"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.includes("sold-number")) {
    return null;
  }
  return (
    <footer className="text-muted-foreground mt-20 border-t px-6 py-10 text-sm md:px-10">
      <div className="mx-auto flex flex-col gap-y-8 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <h3 className="text-foreground text-base font-semibold">Numeralo</h3>
          <p className="mt-2">
            Plataforma para crear y gestionar rifas online.
            <br />
            Los pagos se acreditan directamente en la cuenta de Mercado Pago del
            creador de la rifa.
          </p>
        </div>

        <div className="flex gap-x-12">
          <div className="flex flex-col gap-y-2">
            <span className="text-foreground font-medium">Plataforma</span>
            <Link href="/info">Cómo funciona</Link>
            <Link href="/register">Crear rifa</Link>
            <Link href="/login">Ingresar</Link>
          </div>

          <div className="flex flex-col gap-y-2">
            <span className="text-foreground font-medium">Legal</span>
            <Link href="/terms">Términos y condiciones</Link>
            <Link href="/privacy">Política de privacidad</Link>
          </div>

          <div className="flex flex-col gap-y-2">
            <span className="text-foreground font-medium">Contacto</span>
            <Link href="/contact">Contacto</Link>
            <a
              className="text-primary break-all underline underline-offset-2"
              href="mailto:contacto@numeralo.com"
            >
              contacto@numeralo.com
            </a>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mx-auto mt-10 border-t pt-6 text-xs">
        © {new Date().getFullYear()} Numeralo. Todos los derechos reservados.
      </div>
    </footer>
  );
}
