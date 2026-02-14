import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import AlertCompany from "@/components/shared/alert-company/AlertCompany";
import AuthenticatedNavBar from "@/components/shared/nav-bar/AuthenticatedNavBar";
import SessionProviderNextAuth from "@/components/shared/providers/SessionProviderNextAuth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const companyId = session?.user.companyId;

  return (
    <SessionProviderNextAuth>
      <main className="h-dvh w-full">
        <AuthenticatedNavBar />
        <div className="w-full max-w-525 px-5 pt-20 pb-5 md:px-10 md:pb-8">
          {!companyId && <AlertCompany />}
          {children}
        </div>
      </main>
    </SessionProviderNextAuth>
  );
}
