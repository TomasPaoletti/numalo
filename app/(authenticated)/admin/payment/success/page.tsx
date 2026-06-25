import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <section
      id="success-page-admin"
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">¡Pago aprobado!</h1>
      <p className="text-muted-foreground">
        Tu rifa fue activada exitosamente.
      </p>
      <Link href="/admin">
        <Button>Ir al panel</Button>
      </Link>
    </section>
  );
}
