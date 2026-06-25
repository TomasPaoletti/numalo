import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function FailurePage() {
  return (
    <section
      id="failure-page-admin"
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">Pago fallido</h1>
      <p className="text-muted-foreground">
        No se pudo procesar el pago. Podés intentarlo nuevamente.
      </p>
      <Link href="/admin">
        <Button variant="outline">Volver al panel</Button>
      </Link>
    </section>
  );
}
