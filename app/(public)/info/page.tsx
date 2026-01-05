import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: "Cómo funciona Numeralo",
};

export default function InfoPage() {
  return (
    <main className="flex min-h-svh flex-col gap-y-6 p-4 md:p-10">
      <h1 className="text-3xl font-semibold">Cómo funciona Numeralo</h1>
      <div>
        <h3 className="mb-2 text-xl font-semibold">1. Creación de una rifa</h3>
        <p className="text-muted-foreground">
          Los usuarios registrados en Numeralo pueden crear una rifa definiendo
          el premio, la cantidad de números disponibles y el valor de cada
          número.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">
          2. Publicación de la rifa
        </h3>
        <p className="text-muted-foreground">
          Una vez creada, la rifa es publicada en la plataforma para que otros
          usuarios puedan participar comprando números.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">3. Compra de números</h3>
        <p className="text-muted-foreground">
          Los participantes seleccionan los números que desean y realizan el
          pago a través de Mercado Pago.
          <br />
          El pago se acredita directamente en la cuenta de Mercado Pago del
          creador de la rifa.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">4. Gestión de pagos</h3>
        <p className="text-muted-foreground">
          Numeralo no recibe, administra ni retiene fondos provenientes de las
          rifas.
          <br />
          Todos los pagos son procesados exclusivamente por Mercado Pago.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">5. Modelo de negocio</h3>
        <p className="text-muted-foreground">
          Numeralo cobra una tarifa por el uso de la plataforma, independiente
          de los pagos realizados entre los usuarios.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">
          6. Responsabilidad de los usuarios
        </h3>
        <p className="text-muted-foreground">
          Cada usuario es responsable de la rifa que crea y de cumplir con la
          normativa legal y fiscal aplicable.
          <br />
          Numeralo actúa únicamente como intermediario tecnológico.
        </p>
      </div>
    </main>
  );
}
