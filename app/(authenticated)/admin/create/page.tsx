import { CreateContextProvider } from "@/contexts/CreateContext";

import SectionFooterCreate from "@/components/pages/create/components/SectionFooterCreate";
import SectionFormCreate from "@/components/pages/create/components/SectionFormCreate";
import SectionHeaderCreate from "@/components/pages/create/components/SectionHeaderCreate";

export default async function CreatePage() {
  return (
    <CreateContextProvider>
      <SectionHeaderCreate />
      <SectionFormCreate />
      <SectionFooterCreate />
    </CreateContextProvider>
  );
}
