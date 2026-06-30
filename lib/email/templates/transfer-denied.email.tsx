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

interface TransferDeniedEmailProps {
  payerName: string;
  raffleTitle: string;
  numbers: number[];
  raffleUrl: string;
}

const TransferDeniedEmail = ({
  payerName,
  raffleTitle,
  numbers,
  raffleUrl,
}: TransferDeniedEmailProps) => {
  const firstName = payerName.split(" ")[0];

  return (
    <Html>
      <Head />
      <Preview>Tu comprobante para &quot;{raffleTitle}&quot; no pudo verificarse</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Comprobante no aprobado</Heading>

          <Text style={text}>
            Hola <strong>{firstName}</strong>, lamentablemente el organizador de
            la rifa no pudo verificar tu comprobante de transferencia. Tus
            números fueron liberados.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>{raffleTitle}</Text>

            <Text style={numbersLabel}>Números liberados:</Text>
            <Text style={numbersText}>
              {numbers.map((n) => `#${n}`).join("  ·  ")}
            </Text>
          </Section>

          <Text style={text}>
            Si creés que esto fue un error, podés intentar nuevamente o
            contactarte con el organizador de la rifa.
          </Text>

          <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
            <a href={raffleUrl} style={button}>
              Volver a la rifa
            </a>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Este email fue enviado por Numeralo como notificación del resultado
            de la revisión de tu comprobante.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TransferDeniedEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = { backgroundColor: "#ffffff", margin: "40px auto", padding: "32px", borderRadius: "8px", maxWidth: "560px" };
const h1 = { color: "#111", fontSize: "24px", fontWeight: "700", margin: "0 0 16px" };
const text = { color: "#444", fontSize: "16px", lineHeight: "24px", margin: "0 0 16px" };
const card = { backgroundColor: "#f6f9fc", borderRadius: "8px", padding: "16px 20px", margin: "16px 0" };
const cardTitle = { color: "#111", fontSize: "18px", fontWeight: "600", margin: "0 0 12px" };
const numbersLabel = { color: "#555", fontSize: "13px", fontWeight: "600", margin: "0 0 4px", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const numbersText = { color: "#111", fontSize: "22px", fontWeight: "700", margin: "0 0 12px", letterSpacing: "1px" };
const button = { backgroundColor: "#111", borderRadius: "6px", color: "#fff", display: "inline-block", fontSize: "15px", fontWeight: "600", padding: "12px 24px", textDecoration: "none" };
const hr = { borderColor: "#e6ebf1", margin: "32px 0 16px" };
const footer = { color: "#8898aa", fontSize: "12px", lineHeight: "20px" };
