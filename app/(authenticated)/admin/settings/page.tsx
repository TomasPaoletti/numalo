import CurrentUser from "@/services/user/current-user.service";

import SectionCompanySettings from "@/components/pages/settings/components/SectionCompanySettings";
import SectionUserSettings from "@/components/pages/settings/components/SectionUserSettings";

export default async function SettingsPage() {
  const user = await CurrentUser(true);
  return (
    <div className="flex w-full flex-col gap-y-5">
      <SectionUserSettings user={user} />
      <SectionCompanySettings company={user.company} />
    </div>
  );
}
