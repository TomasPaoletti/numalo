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
        <div className="container mx-auto w-full px-6 pt-20 pb-6 md:pb-12">
          {!companyId && <AlertCompany />}
          {children}
        </div>
      </main>
    </SessionProviderNextAuth>
  );
}
