import "dotenv/config";

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Poner el raffle que querramos llenar
const RAFFLE_ID = "";
const SKIP_NUMBER = 20;
const TOTAL_NUMBERS = 100;

const FAKE_BUYERS = [
  {
    name: "Lucía Martínez",
    email: "lucia.martinez@gmail.com",
    phone: "1145678901",
    instagram: "@luciamartinez",
  },
  {
    name: "Santiago Gómez",
    email: "santiago.gomez@gmail.com",
    phone: "1156789012",
    instagram: "@santigomez",
  },
  {
    name: "Valentina López",
    email: "valentina.lopez@hotmail.com",
    phone: "1167890123",
    instagram: "@valen.lopez",
  },
  {
    name: "Matías Rodríguez",
    email: "matias.rodriguez@gmail.com",
    phone: "1178901234",
    instagram: "@matiasrod",
  },
  {
    name: "Camila Fernández",
    email: "camila.fernandez@yahoo.com",
    phone: "1189012345",
    instagram: "@cami_fer",
  },
  {
    name: "Tomás Pérez",
    email: "tomas.perez@gmail.com",
    phone: "1190123456",
    instagram: "@tomasperez",
  },
  {
    name: "Florencia García",
    email: "florencia.garcia@gmail.com",
    phone: "1101234567",
    instagram: "@flogarcia",
  },
  {
    name: "Nicolás Díaz",
    email: "nicolas.diaz@outlook.com",
    phone: "1112345678",
    instagram: "@nicodiaz",
  },
  {
    name: "Agustina Torres",
    email: "agustina.torres@gmail.com",
    phone: "1123456789",
    instagram: "@agus.torres",
  },
  {
    name: "Ignacio Ruiz",
    email: "ignacio.ruiz@gmail.com",
    phone: "1134567890",
    instagram: "@ignaruiz",
  },
];

function getFakeBuyer(index: number) {
  return FAKE_BUYERS[index % FAKE_BUYERS.length];
}

async function main() {
  console.log(`🌱 Creando números vendidos para la rifa ${RAFFLE_ID}...`);
  console.log(`⏭️  Saltando número ${SKIP_NUMBER}`);

  const raffle = await prisma.raffle.findUnique({
    where: { id: RAFFLE_ID },
  });

  if (!raffle) {
    throw new Error(`Rifa ${RAFFLE_ID} no encontrada`);
  }

  console.log(`✅ Rifa encontrada: ${raffle.title}`);

  // Limpiar SoldNumbers y Payments de NUMBER_PURCHASE existentes de esta rifa
  await prisma.soldNumber.deleteMany({
    where: { raffleId: RAFFLE_ID },
  });

  await prisma.payment.deleteMany({
    where: {
      raffleId: RAFFLE_ID,
      paymentType: "NUMBER_PURCHASE",
    },
  });

  console.log("🧹 Datos anteriores limpiados");

  let created = 0;

  for (let number = 1; number <= TOTAL_NUMBERS; number++) {
    if (number === SKIP_NUMBER) {
      console.log(`⏭️  Saltando número ${number}`);
      continue;
    }

    const buyer = getFakeBuyer(number);

    // Crear payment fake
    const payment = await prisma.payment.create({
      data: {
        amount: raffle.numberPrice,
        currency: "ARS",
        status: "APPROVED",
        provider: "MERCADO_PAGO",
        providerPaymentId: `fake-payment-${RAFFLE_ID}-${number}`,
        paymentType: "NUMBER_PURCHASE",
        raffleId: RAFFLE_ID,
        payerName: buyer.name,
        payerEmail: buyer.email,
        payerPhone: buyer.phone,
        payerInstagram: buyer.instagram,
        paidAt: new Date(),
      },
    });

    // Crear soldNumber asociado
    await prisma.soldNumber.create({
      data: {
        number,
        raffleId: RAFFLE_ID,
        paymentId: payment.id,
        status: "SOLD",
        reservedBy: buyer.email,
        reservedAt: new Date(),
      },
    });

    created++;
    process.stdout.write(`\r📦 Creados: ${created}/99`);
  }

  console.log("\n");
  console.log("🎉 Script completado!");
  console.log("─────────────────────────────────");
  console.log(`✅ Números vendidos: ${created}`);
  console.log(`⏭️  Número libre: #${SKIP_NUMBER}`);
  console.log("─────────────────────────────────");
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
