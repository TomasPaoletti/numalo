import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <section
      id="pending-page-admin"
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">Pago pendiente</h1>
      <p className="text-muted-foreground">
        El pago está siendo procesado. Te notificaremos cuando se confirme.
      </p>
      <Link href="/admin">
        <Button variant="outline">Ir al panel</Button>
      </Link>
    </section>
  );
}
