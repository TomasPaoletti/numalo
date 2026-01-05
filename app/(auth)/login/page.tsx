import { Metadata } from "next";

import LoginForm from "@/components/pages/login/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesion",
  description: "Inicia sesion en tu cuenta",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4 md:p-10">
      <LoginForm />
    </main>
  );
}
