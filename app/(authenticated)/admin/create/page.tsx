import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { CreateContextProvider } from "@/contexts/CreateContext";

import SectionFormCreate from "@/components/pages/create/components/SectionFormCreate";
import SectionHeaderCreate from "@/components/pages/create/components/SectionHeaderCreate";

export default async function CreatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.companyId || !session.user.hasBankDetails) {
    redirect("/admin/settings");
  }

  return (
    <CreateContextProvider>
      <SectionHeaderCreate />
      <SectionFormCreate />
    </CreateContextProvider>
  );
}
