import prisma from "@/lib/prisma";

import bcrypt from "bcryptjs";

const SEED_COMPANY_ID = "seed-company-001";
const SEED_USER_ID = "seed-user-001";
const SEED_RAFFLE_ID = "seed-raffle-001";
const SEED_ACTIVATION_PAYMENT_ID = "seed-payment-activation-001";
const SEED_PURCHASE_PAYMENT_ID = "seed-payment-purchase-001";
const SEED_SOLD_NUMBER_ID = "seed-sold-number-001";

async function main() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan variables de entorno: SEED_USER_EMAIL y SEED_USER_PASSWORD son requeridas"
    );
  }

  console.log("🌱 Iniciando seed...");

  const company = await prisma.company.upsert({
    where: { id: SEED_COMPANY_ID },
    update: {
      name: "Empresa de Prueba",
      phone: "1143211234",
    },
    create: {
      id: SEED_COMPANY_ID,
      name: "Empresa de Prueba",
      phone: "1143211234",
    },
  });

  console.log(`✅ Company: ${company.name} (${company.id})`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Seed",
      companyId: company.id,
    },
    create: {
      id: SEED_USER_ID,
      email,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Seed",
      companyId: company.id,
    },
  });

  console.log(`✅ Usuario: ${user.email} (${user.id})`);

  const raffle = await prisma.raffle.upsert({
    where: { id: SEED_RAFFLE_ID },
    update: {
      title: "Rifa de Prueba",
      description: "Esta es una rifa de prueba generada por el seed.",
      totalNumbers: 100,
      numberPrice: 1000,
      status: "ACTIVE",
      publishedAt: new Date(),
    },
    create: {
      id: SEED_RAFFLE_ID,
      title: "Rifa de Prueba",
      description: "Esta es una rifa de prueba generada por el seed.",
      totalNumbers: 100,
      numberPrice: 1000,
      hasQuantityDiscount: false,
      drawMethod: "ALEATORIO",
      drawTrigger: "FECHA_FIJA",
      drawDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      publishedAt: new Date(),
      companyId: company.id,
    },
  });

  console.log(`✅ Rifa: ${raffle.title} (${raffle.id})`);

  await prisma.payment.upsert({
    where: { id: SEED_ACTIVATION_PAYMENT_ID },
    update: { status: "APPROVED" },
    create: {
      id: SEED_ACTIVATION_PAYMENT_ID,
      amount: 5000,
      currency: "ARS",
      status: "APPROVED",
      provider: "MERCADO_PAGO",
      providerPaymentId: "seed-activation-payment",
      paymentType: "RAFFLE_ACTIVATION",
      raffleId: raffle.id,
      payerName: "Admin Seed",
      payerEmail: email,
      paidAt: new Date(),
    },
  });

  console.log(`✅ Payment de activación vinculado`);

  const numberPayment = await prisma.payment.upsert({
    where: { id: SEED_PURCHASE_PAYMENT_ID },
    update: { status: "APPROVED" },
    create: {
      id: SEED_PURCHASE_PAYMENT_ID,
      amount: 1000,
      currency: "ARS",
      status: "APPROVED",
      provider: "MERCADO_PAGO",
      providerPaymentId: "seed-purchase-payment",
      paymentType: "NUMBER_PURCHASE",
      raffleId: raffle.id,
      payerName: "Juan Comprador",
      payerEmail: "comprador@test.com",
      payerPhone: "1155667788",
      payerInstagram: "@juancomprador",
      paidAt: new Date(),
    },
  });

  console.log(`✅ Payment de compra creado`);

  const soldNumber = await prisma.soldNumber.upsert({
    where: { id: SEED_SOLD_NUMBER_ID },
    update: { status: "SOLD" },
    create: {
      id: SEED_SOLD_NUMBER_ID,
      number: 42,
      raffleId: raffle.id,
      paymentId: numberPayment.id,
      status: "SOLD",
      reservedBy: "comprador@test.com",
      reservedAt: new Date(),
    },
  });

  console.log(`✅ Número vendido: #${soldNumber.number}`);

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("─────────────────────────────────");
  console.log(`📧 Email:    ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`🏢 Company:  ${company.name}`);
  console.log(`🎟️  Rifa:     ${raffle.title}`);
  console.log(`🔢 Número vendido: #${soldNumber.number}`);
  console.log("─────────────────────────────────");
}

main()
  .catch((error) => {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
