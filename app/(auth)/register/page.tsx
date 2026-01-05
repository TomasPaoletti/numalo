import { Metadata } from "next";

import RegisterForm from "@/components/pages/register/RegisterForm";

export const metadata: Metadata = {
  title: "Registro",
  description: "Crea tu cuenta",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4 md:p-10">
      <RegisterForm />
    </main>
  );
}
