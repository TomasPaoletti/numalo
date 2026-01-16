import { InfoIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AlertCompany = () => {
  return (
    <div className="mb-5 w-full">
      <Link href="admin/settings">
        <Alert>
          <InfoIcon />
          <AlertTitle>Registra tu compañia</AlertTitle>
          <AlertDescription>
            Para que puedas crear tu primera rifa debes registrar tu compañia
          </AlertDescription>
        </Alert>
      </Link>
    </div>
  );
};
export default AlertCompany;
