"use client";

import { InfoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AlertMp = () => {
  const { data } = useSession();

  const companyId = data?.user.companyId;
  const connectMp = data?.user.mpConnected;

  if (!companyId || connectMp) return null;

  return (
    <div className="mb-5 w-full">
      <Link href="/admin/settings">
        <Alert>
          <InfoIcon />
          <AlertTitle>Conecta tu Mercado Pago</AlertTitle>
          <AlertDescription>
            Para que puedas crear tu primera rifa y recibir los pagos, debes
            conectar tu mercado pago
          </AlertDescription>
        </Alert>
      </Link>
    </div>
  );
};
export default AlertMp;
