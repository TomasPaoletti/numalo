import { InfoIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertCompanyProps {
  variant?: "no-company" | "no-bank-details";
}

const AlertCompany = ({ variant = "no-company" }: AlertCompanyProps) => {
  const content =
    variant === "no-bank-details"
      ? {
          title: "Agregá tus datos bancarios",
          description:
            "Para poder crear rifas necesitás cargar un alias o CBU en los ajustes de tu compañía.",
        }
      : {
          title: "Registra tu compañia",
          description:
            "Para que puedas crear tu primera rifa debes registrar tu compañia",
        };

  return (
    <div className="mb-5 w-full">
      <Link href="/admin/settings">
        <Alert>
          <InfoIcon />
          <AlertTitle>{content.title}</AlertTitle>
          <AlertDescription>{content.description}</AlertDescription>
        </Alert>
      </Link>
    </div>
  );
};
export default AlertCompany;
