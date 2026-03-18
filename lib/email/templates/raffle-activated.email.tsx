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

interface RaffleActivatedEmailProps {
  companyName: string;
  raffleTitle: string;
  raffleUrl: string;
  totalNumbers: number;
  numberPrice: number;
}

const RaffleActivatedEmail = ({
  companyName,
  raffleTitle,
  raffleUrl,
  totalNumbers,
  numberPrice,
}: RaffleActivatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu rifa "{raffleTitle}" ya está activa 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Tu rifa está activa! 🎉</Heading>

          <Text style={text}>
            Hola <strong>{companyName}</strong>, tu rifa está publicada y lista
            para recibir participantes.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>{raffleTitle}</Text>
            <Text style={cardDetail}>
              🎟️ {totalNumbers} números disponibles
            </Text>
            <Text style={cardDetail}>
              💰 ${numberPrice.toLocaleString("es-AR")} por número
            </Text>
          </Section>

          <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
            <a href={raffleUrl} style={button}>
              Ver mi rifa
            </a>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>Este email fue enviado por Numeralo.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default RaffleActivatedEmail;

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
  margin: "16px 0",
};

const cardTitle = {
  color: "#111",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const cardDetail = {
  color: "#555",
  fontSize: "14px",
  margin: "4px 0",
};

const button = {
  backgroundColor: "#111",
  borderRadius: "6px",
  color: "#fff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
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
