"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground text-lg">
        Error al obtener los numeros
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
