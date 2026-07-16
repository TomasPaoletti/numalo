import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso de Numeralo, la plataforma para crear y gestionar rifas online.",
};

function SectionNum({ n }: { n: string }) {
  return (
    <span className="border-primary/26 bg-primary/13 text-primary inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border font-mono text-[11.5px] font-semibold">
      {n}
    </span>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto space-y-0 px-6 py-16 pb-24">
      {/* Header */}
      <div className="border-border border-b pb-10">
        <span className="text-primary mb-2.5 block text-[11.5px] font-semibold tracking-[0.09em] uppercase">
          Legal
        </span>
        <h1 className="mb-3 text-[42px] leading-[1.1] font-bold tracking-[-0.025em]">
          Términos y condiciones
        </h1>
        <p className="text-muted-foreground text-sm">
          Última actualización: junio de 2026
        </p>
        <p className="text-muted-foreground mt-4 text-[16px] leading-[1.75] text-pretty">
          Al usar Numeralo aceptás estos términos. Te pedimos que los leas con
          atención. Si tenés preguntas, podés escribirnos a{" "}
          <a
            href="mailto:contacto@send.numeraloapp.com"
            className="text-primary hover:underline"
          >
            contacto@send.numeraloapp.com
          </a>
          .
        </p>
      </div>

      {/* Section 1 */}
      <section className="border-border border-b pt-9 pb-9">
        <div className="mb-3.5 flex items-center gap-2.5">
          <SectionNum n="1" />
          <h2 className="text-[19px] font-semibold tracking-[-0.015em]">
            Rol de Numeralo
          </h2>
        </div>
        <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
          <p>
            Numeralo es una{" "}
            <strong className="text-foreground font-medium">
              plataforma tecnológica
            </strong>{" "}
            que facilita la creación y gestión de rifas online. No organiza,
            administra ni garantiza ninguna de las rifas publicadas por los
            usuarios.
          </p>
          <p>
            La relación contractual en cada rifa es exclusivamente entre el
            organizador y los participantes. Numeralo actúa como intermediario
            tecnológico neutral, sin intervención en el contenido de las rifas
            ni en la entrega de premios.
          </p>
          <p>
            Numeralo se reserva el derecho de suspender o eliminar rifas que
            incumplan estos términos, la legislación vigente o que representen
            un riesgo para los usuarios.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="border-border border-b pt-9 pb-9">
        <div className="mb-3.5 flex items-center gap-2.5">
          <SectionNum n="2" />
          <h2 className="text-[19px] font-semibold tracking-[-0.015em]">
            Pagos
          </h2>
        </div>
        <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
          <p>
            La compra de números se realiza por{" "}
            <strong className="text-foreground font-medium">
              transferencia bancaria directa
            </strong>{" "}
            del participante a la cuenta del organizador. El participante sube
            el comprobante y el organizador lo revisa y aprueba para confirmar
            la venta. Numeralo no recibe, retiene ni administra los fondos de la
            venta de números en ningún momento.
          </p>
          <p>
            La única operación que pasa por{" "}
            <strong className="text-foreground font-medium">
              Mercado Pago
            </strong>{" "}
            es la tarifa de publicación que el organizador abona a Numeralo para
            activar su rifa. Esta tarifa corresponde únicamente al servicio de
            la plataforma y es independiente del resultado de la rifa. No se
            realizan reembolsos de tarifas de publicación salvo que Numeralo
            cancele el servicio sin causa imputable al organizador.
          </p>
        </div>
        <div className="border-border bg-muted/50 mt-4 flex items-start gap-3 rounded-[10px] border px-4 py-3.5">
          <svg
            className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-muted-foreground text-[13.5px] leading-[1.65]">
            Numeralo no almacena información de tarjetas de crédito ni datos
            financieros sensibles. Los datos de la tarifa de activación son
            gestionados por Mercado Pago; la compra de números se abona por
            transferencia bancaria directa entre participante y organizador, sin
            intervención de Numeralo.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="border-border border-b pt-9 pb-9">
        <div className="mb-3.5 flex items-center gap-2.5">
          <SectionNum n="3" />
          <h2 className="text-[19px] font-semibold tracking-[-0.015em]">
            Responsabilidad del organizador
          </h2>
        </div>
        <p className="text-muted-foreground mb-3 text-[15px] leading-[1.8] text-pretty">
          Cada usuario que crea una rifa en Numeralo es{" "}
          <strong className="text-foreground font-medium">
            plenamente responsable
          </strong>{" "}
          del cumplimiento legal, fiscal y contractual de su rifa con los
          participantes. Esto incluye, entre otros:
        </p>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-[15px] leading-[1.8]">
          <li>
            El cumplimiento de las normativas sobre rifas, sorteos y juegos de
            azar de su jurisdicción.
          </li>
          <li>
            La entrega efectiva del premio al ganador dentro del plazo acordado.
          </li>
          <li>El correcto tratamiento fiscal de los ingresos percibidos.</li>
          <li>
            La veracidad de la información publicada sobre el premio y las
            condiciones del sorteo.
          </li>
        </ul>
        <p className="text-muted-foreground mt-3 text-[15px] leading-[1.8] text-pretty">
          Numeralo no forma parte de la relación contractual entre organizador y
          participantes. Ante cualquier conflicto o incumplimiento, la
          responsabilidad recae exclusivamente sobre el organizador.
        </p>
      </section>

      {/* Section 4 */}
      <section className="pt-9">
        <div className="mb-3.5 flex items-center gap-2.5">
          <SectionNum n="4" />
          <h2 className="text-[19px] font-semibold tracking-[-0.015em]">
            Activación de la rifa y Mercado Pago
          </h2>
        </div>
        <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
          <p>
            Numeralo utiliza{" "}
            <strong className="text-foreground font-medium">
              Mercado Pago
            </strong>{" "}
            únicamente como medio para cobrar la tarifa de activación de las
            rifas. Para publicar una rifa, el organizador abona esta tarifa a
            través de Mercado Pago y acepta sus términos y condiciones. Mercado
            Pago no interviene en la compra de números.
          </p>
          <p>
            Numeralo no es responsable de interrupciones, demoras o errores en
            el procesamiento de la tarifa de activación atribuibles a Mercado
            Pago. La relación entre el usuario y Mercado Pago es directa e
            independiente de la relación con Numeralo.
          </p>
        </div>
      </section>

      {/* Footer note */}
      <div className="border-border mt-11 border-t pt-11">
        <p className="text-muted-foreground text-[13.5px] leading-[1.7]">
          ¿Tenés preguntas sobre estos términos? Contactanos en{" "}
          <a
            href="mailto:contacto@send.numeraloapp.com"
            className="text-primary hover:underline"
          >
            contacto@send.numeraloapp.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
