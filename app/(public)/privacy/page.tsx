import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numeralo — Política de privacidad",
  description:
    "Política de privacidad de Numeralo. Cómo recopilamos, usamos y protegemos tu información personal.",
};

function SectionNum({ n }: { n: string }) {
  return (
    <span className="border-primary/26 bg-primary/13 text-primary inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border font-mono text-[11.5px] font-semibold">
      {n}
    </span>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto px-6 py-16 pb-24">
      {/* Header */}
      <div className="border-border mb-0 border-b pb-10">
        <span className="text-primary mb-2.5 block text-[11.5px] font-semibold tracking-[0.09em] uppercase">
          Legal
        </span>
        <h1 className="mb-3 text-[42px] leading-[1.1] font-bold tracking-[-0.025em]">
          Política de privacidad
        </h1>
        <p className="text-muted-foreground text-sm">
          Última actualización: junio de 2026
        </p>
        <p className="text-muted-foreground mt-4 text-[16px] leading-[1.75] text-pretty">
          En Numeralo valoramos la privacidad de nuestros usuarios. Esta
          política describe qué información recopilamos, cómo la usamos y cómo
          la protegemos. Si tenés preguntas, escribinos a{" "}
          <a
            href="mailto:contacto@numeralo.com"
            className="text-primary hover:underline"
          >
            contacto@numeralo.com
          </a>
          .
        </p>
      </div>

      {/* Sections */}
      {[
        {
          n: "1",
          title: "Información que recopilamos",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
              <p>
                Recopilamos únicamente la información necesaria para brindar el
                servicio:{" "}
                <strong className="text-foreground font-medium">
                  nombre, apellido, dirección de email y datos de cuenta
                </strong>
                . Esta información se obtiene al momento del registro o al
                completar tu perfil de organizador.
              </p>
              <p>
                No recopilamos información adicional sin tu consentimiento. El
                objetivo es mantener el perfil del usuario lo más simple
                posible.
              </p>
            </div>
          ),
        },
        {
          n: "2",
          title: "Uso de la información",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8]">
              <p>Utilizamos tu información para los siguientes fines:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="text-foreground font-medium">
                    Registro y autenticación
                  </strong>{" "}
                  — Para identificarte y permitirte acceder a tu cuenta.
                </li>
                <li>
                  <strong className="text-foreground font-medium">
                    Gestión de rifas
                  </strong>{" "}
                  — Para asociar las rifas que creás a tu cuenta y facilitar la
                  comunicación con participantes.
                </li>
                <li>
                  <strong className="text-foreground font-medium">
                    Comunicaciones
                  </strong>{" "}
                  — Para enviarte notificaciones relacionadas con tus rifas
                  (confirmaciones, alertas de estado).
                </li>
                <li>
                  <strong className="text-foreground font-medium">
                    Mejora de la plataforma
                  </strong>{" "}
                  — Para entender cómo se usa el servicio y optimizar la
                  experiencia.
                </li>
              </ul>
              <p>
                No usamos tu información para publicidad de terceros ni la
                cedemos con fines comerciales.
              </p>
            </div>
          ),
        },
        {
          n: "3",
          title: "Pagos",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
              <p>
                La compra de números se abona por{" "}
                <strong className="text-foreground font-medium">
                  transferencia bancaria directa
                </strong>{" "}
                entre el participante y el organizador. La tarifa de activación
                de la rifa se procesa a través de{" "}
                <strong className="text-foreground font-medium">
                  Mercado Pago
                </strong>
                . En ambos casos, Numeralo no almacena ni tiene acceso a datos
                de tarjetas de crédito, cuentas bancarias ni ningún dato
                financiero sensible.
              </p>
              <div className="border-primary/20 bg-primary/8 mt-1 flex items-start gap-3 rounded-[10px] border px-4 py-3.5">
                <p className="text-[13.5px] leading-[1.65]">
                  Los datos de la tarifa de activación son gestionados
                  exclusivamente por Mercado Pago bajo sus propios estándares de
                  seguridad. El comprobante de transferencia que suben los
                  participantes al comprar números queda asociado a la rifa para
                  que el organizador lo verifique. Consultá la política de
                  privacidad de Mercado Pago para más información sobre la
                  tarifa de activación.
                </p>
              </div>
            </div>
          ),
        },
        {
          n: "4",
          title: "Compartición de datos",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
              <p>
                Numeralo{" "}
                <strong className="text-foreground font-medium">
                  no comparte tu información personal con terceros
                </strong>
                , salvo en los siguientes casos:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Cuando sea requerido por orden judicial o autoridad competente
                  conforme a la legislación vigente.
                </li>
                <li>
                  Cuando sea estrictamente necesario para la prestación del
                  servicio (por ejemplo, Mercado Pago para la tarifa de
                  activación).
                </li>
              </ul>
              <p>
                En todos los casos, la cesión se limita a la información mínima
                necesaria para el fin específico.
              </p>
            </div>
          ),
        },
        {
          n: "5",
          title: "Seguridad",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
              <p>
                Implementamos{" "}
                <strong className="text-foreground font-medium">
                  medidas técnicas y organizativas razonables
                </strong>{" "}
                para proteger la información de los usuarios frente a accesos no
                autorizados, pérdida, alteración o divulgación.
              </p>
              <p>
                Ningún sistema de seguridad es infalible. Te recomendamos usar
                contraseñas seguras y no compartir tus credenciales. Si detectás
                actividad sospechosa en tu cuenta, contactanos de inmediato.
              </p>
            </div>
          ),
        },
        {
          n: "6",
          title: "Derechos del usuario",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
              <p>
                Tenés derecho a{" "}
                <strong className="text-foreground font-medium">
                  acceder, modificar o eliminar
                </strong>{" "}
                la información personal asociada a tu cuenta en cualquier
                momento, directamente desde la configuración de tu cuenta o
                contactándonos por email.
              </p>
              <p>
                Si solicitás la eliminación de tu cuenta, borraremos tu
                información personal dentro de un plazo razonable, excepto
                cuando debamos conservarla por obligaciones legales o para
                resolver disputas pendientes.
              </p>
            </div>
          ),
        },
        {
          n: "7",
          title: "Cambios en esta política",
          content: (
            <div className="text-muted-foreground space-y-3 text-[15px] leading-[1.8] text-pretty">
              <p>
                Numeralo puede actualizar esta política de privacidad cuando sea
                necesario. Los cambios se publican en esta misma página con la
                fecha de última actualización actualizada.
              </p>
              <p>
                Si los cambios son sustanciales, te notificaremos por email o
                mediante un aviso destacado en la plataforma antes de que entren
                en vigencia.
              </p>
            </div>
          ),
        },
      ].map(({ n, title, content }) => (
        <section key={n} className="border-border border-b pt-9 pb-9">
          <div className="mb-3.5 flex items-center gap-2.5">
            <SectionNum n={n} />
            <h2 className="text-[19px] font-semibold tracking-[-0.015em]">
              {title}
            </h2>
          </div>
          {content}
        </section>
      ))}

      {/* Contact */}
      <section className="pt-9">
        <h2 className="mb-3 text-[19px] font-semibold tracking-[-0.015em]">
          Contacto
        </h2>
        <p className="text-muted-foreground text-[15px] leading-[1.8] text-pretty">
          Para cualquier consulta sobre esta política de privacidad o el
          tratamiento de tus datos, podés escribirnos a{" "}
          <a
            href="mailto:contacto@numeralo.com"
            className="text-primary hover:underline"
          >
            contacto@numeralo.com
          </a>
          . Respondemos en un plazo máximo de 48 horas hábiles.
        </p>
      </section>
    </main>
  );
}
