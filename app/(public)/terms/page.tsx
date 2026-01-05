import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos y condiciones",
  description: "Terminos y condiciones de numeralo",
};

export default function TermsPage() {
  return (
    <main className="flex min-h-svh flex-col gap-y-6 p-4 md:p-10">
      <h1 className="text-3xl font-semibold">Terminos y condiciones</h1>
      <div>
        <h3 className="mb-2 text-xl font-semibold">1. Rol de Numeralo</h3>
        <p className="text-muted-foreground">
          Numeralo es una plataforma tecnológica que facilita la creación y
          gestión de rifas online entre usuarios.
          <br />
          Numeralo no organiza, administra ni garantiza las rifas publicadas por
          los usuarios.
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-xl font-semibold">2. Pagos</h3>
        <p className="text-muted-foreground">
          Todos los pagos realizados en la plataforma son procesados por Mercado
          Pago y se acreditan directamente en la cuenta del usuario creador de
          la rifa.
          <br />
          Numeralo no recibe, retiene ni administra fondos correspondientes a
          las rifas.
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-xl font-semibold">3. Responsabilidad</h3>
        <p className="text-muted-foreground">
          Cada usuario es responsable del cumplimiento legal, fiscal y normativo
          de las rifas que publica.
          <br />
          Numeralo no forma parte de la relación contractual entre los usuarios
          participantes de una rifa.
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-xl font-semibold">
          4. Relación con Mercado Pago
        </h3>
        <p className="text-muted-foreground">
          Numeralo utiliza Mercado Pago como proveedor de servicios de pago.
          <br />
          Mercado Pago es responsable del procesamiento de los pagos conforme a
          sus propios términos y condiciones, los cuales deben ser aceptados por
          los usuarios.
        </p>
      </div>
    </main>
  );
}
