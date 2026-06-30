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

interface QuinielaPendingWinnerEmailProps {
  companyName: string;
  raffleTitle: string;
  statsUrl: string;
}

const QuinielaPendingWinnerEmail = ({
  companyName,
  raffleTitle,
  statsUrl,
}: QuinielaPendingWinnerEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Ingresá el número de quiniela para cerrar "{raffleTitle}"</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Rifa cerrada — falta el ganador 🎰</Heading>

          <Text style={text}>
            Hola <strong>{companyName}</strong>, tu rifa se cerró exitosamente.
            El siguiente paso es ingresar el número de la Quiniela Nacional para
            determinar el ganador.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>{raffleTitle}</Text>
            <Text style={cardDetail}>
              Una vez que salga el resultado de la Quiniela Nacional, entrá al
              panel de administración y registrá el número ganador.
            </Text>
          </Section>

          <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
            <a href={statsUrl} style={button}>
              Ingresar número de quiniela
            </a>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>Este email fue enviado por Numeralo.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default QuinielaPendingWinnerEmail;

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
  backgroundColor: "#fefce8",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  border: "1px solid #fde047",
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
  lineHeight: "20px",
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
