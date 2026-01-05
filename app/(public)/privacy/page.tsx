import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Numeralo",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-svh flex-col gap-y-6 p-4 md:p-10">
      <h1 className="text-3xl font-semibold">Política de Privacidad</h1>
      <div>
        <h3 className="mb-2 text-xl font-semibold">
          1. Información recopilada
        </h3>
        <p className="text-muted-foreground">
          Numeralo recopila únicamente la información necesaria para el
          funcionamiento de la plataforma, incluyendo nombre, apellido,
          dirección de correo electrónico y datos relacionados con la cuenta del
          usuario.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">2. Uso de la información</h3>
        <p className="text-muted-foreground">
          La información recopilada se utiliza exclusivamente para:
          <br />
          - Permitir el registro y autenticación de usuarios
          <br />
          - Gestionar la creación y participación en rifas
          <br />- Mejorar el funcionamiento y la seguridad de la plataforma
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">
          3. Procesamiento de pagos
        </h3>
        <p className="text-muted-foreground">
          Los pagos realizados a través de Numeralo son procesados
          exclusivamente por Mercado Pago.
          <br />
          Numeralo no almacena ni procesa información sensible de pago, como
          datos de tarjetas de crédito o débito.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">4. Compartición de datos</h3>
        <p className="text-muted-foreground">
          Numeralo no comparte datos personales con terceros, salvo cuando sea
          necesario para el correcto funcionamiento del servicio o cuando sea
          requerido por autoridades competentes conforme a la legislación
          vigente.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">5. Seguridad</h3>
        <p className="text-muted-foreground">
          Numeralo adopta medidas técnicas y organizativas razonables para
          proteger la información personal de los usuarios contra accesos no
          autorizados, pérdida o uso indebido.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">
          6. Derechos de los usuarios
        </h3>
        <p className="text-muted-foreground">
          Los usuarios pueden solicitar el acceso, modificación o eliminación de
          sus datos personales escribiendo a los canales de contacto habilitados
          por Numeralo.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">
          7. Cambios en la política
        </h3>
        <p className="text-muted-foreground">
          Numeralo se reserva el derecho de modificar esta Política de
          Privacidad en cualquier momento. Las modificaciones serán publicadas
          en esta misma página.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">8. Contacto</h3>
        <p className="text-muted-foreground">
          Para cualquier consulta relacionada con esta Política de Privacidad,
          podés contactarnos a través del correo electrónico de soporte de la
          plataforma.
        </p>
      </div>
    </main>
  );
}
