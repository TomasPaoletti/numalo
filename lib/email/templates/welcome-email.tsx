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

interface WelcomeEmailProps {
  firstName: string;
  lastName: string;
  appUrl: string;
}

const WelcomeEmail = ({ firstName, lastName, appUrl }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a Numeralo 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Bienvenido a Numeralo! 🎉</Heading>

          <Text style={text}>
            Hola{" "}
            <strong>
              {firstName} {lastName}
            </strong>
            , tu cuenta fue creada correctamente.
          </Text>

          <Text style={text}>
            Ya podés empezar a crear tus propias rifas y compartirlas con tus
            participantes en minutos.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>🚀 ¿Qué podés hacer ahora?</Text>
            <Text style={cardDetail}>• Crear tu primera rifa</Text>
            <Text style={cardDetail}>• Compartirla con tus contactos</Text>
            <Text style={cardDetail}>• Gestionar participantes fácilmente</Text>
          </Section>

          <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
            <a href={appUrl} style={button}>
              Ir a mi cuenta
            </a>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>El equipo de Numeralo</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
