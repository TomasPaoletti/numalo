import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PendingRaffle {
  title: string;
  pendingCount: number;
  statsUrl: string;
}

interface PendingComprobantesEmailProps {
  companyName: string;
  raffles: PendingRaffle[];
}

const PendingComprobantesEmail = ({
  companyName,
  raffles,
}: PendingComprobantesEmailProps) => {
  const totalPending = raffles.reduce((sum, r) => sum + r.pendingCount, 0);

  return (
    <Html>
      <Head />
      <Preview>
        {`Tenés ${totalPending} pago${totalPending !== 1 ? "s" : ""} pendiente${totalPending !== 1 ? "s" : ""} de revisión`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Pagos pendientes de revisión</Heading>

          <Text style={text}>
            Hola <strong>{companyName}</strong>, tenés comprob
            {totalPending !== 1 ? "antes" : "ante"} de transferencia esperando
            tu aprobación. Entrá al panel para aprobar o denegar cada pago.
          </Text>

          {raffles.map((raffle) => (
            <Section key={raffle.statsUrl} style={card}>
              <Text style={cardTitle}>{raffle.title}</Text>
              <Text style={cardDetail}>
                🕐 {raffle.pendingCount} pago
                {raffle.pendingCount !== 1 ? "s" : ""} pendiente
                {raffle.pendingCount !== 1 ? "s" : ""}
              </Text>
              <a href={raffle.statsUrl} style={link}>
                Revisar comprobantes →
              </a>
            </Section>
          ))}

          <Hr style={hr} />

          <Text style={footer}>Este email fue enviado por Numeralo.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PendingComprobantesEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "32px",
  borderRadius: "8px",
  maxWidth: "560px",
};

const h1 = {
  color: "#111",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 16px",
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const card = {
  backgroundColor: "#f6f9fc",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "12px 0",
};

const cardTitle = {
  color: "#111",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 6px",
};

const cardDetail = {
  color: "#555",
  fontSize: "14px",
  margin: "0 0 10px",
};

const link = {
  color: "#111",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0 16px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
};
