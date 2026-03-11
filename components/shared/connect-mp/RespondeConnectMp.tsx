"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ResponseCoonectMpProps {
  response: string;
}

const ResponseConnectMp = ({ response }: ResponseCoonectMpProps) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/admin/settings");
      return;
    }

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timeLeft]);

  switch (response) {
    case "error":
      return (
        <section id="error-mp">
          <h1 className="text-xl md:text-3xl">
            Error al autenticar mercado pago
          </h1>
          <p>Seras redirigido en: {timeLeft}</p>
        </section>
      );

    case "cancelled":
      return (
        <section id="cancelled-mp">
          <h1 className="text-xl md:text-3xl">
            La autenticacion de mercado pago a sido cancelada
          </h1>
          <p>Seras redirigido en: {timeLeft}</p>
        </section>
      );
    case "success":
      return (
        <section id="success-mp">
          <h1 className="text-xl md:text-3xl">
            ¡Autenticacion realizada con exito!
          </h1>
          <p>Seras redirigido en: {timeLeft}</p>
        </section>
      );
    default:
      break;
  }
};

export default ResponseConnectMp;
