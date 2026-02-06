import CreatePaymentPreference from "@/services/payment/create-payment-preference";

const CallPaymentPreference = async (raffleId: string) => {
  try {
    const { initPoint } = await CreatePaymentPreference(raffleId);
    window.location.href = initPoint;
  } catch (error: any) {
    console.error(error.message);
  }
};

export { CallPaymentPreference };
