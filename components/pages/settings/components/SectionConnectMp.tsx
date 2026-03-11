"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SectionConnectMpProps {
  mpAccessToken?: string | null;
}

const SectionConnectMp = ({ mpAccessToken }: SectionConnectMpProps) => {
  const connectMercadoPago = () => {
    window.location.href = "/api/webhooks/mercadopago/oauth/connect";
  };

  if (!mpAccessToken) {
    return (
      <section id="connect-mp">
        <Button className="bg-[#3483fa]" onClick={connectMercadoPago}>
          Conectar mercado pago
        </Button>
      </section>
    );
  }
  return (
    <section id="connect-mp">
      <Badge className="bg-[#3483fa]">Mercado pago conectado</Badge>
    </section>
  );
};
export default SectionConnectMp;
