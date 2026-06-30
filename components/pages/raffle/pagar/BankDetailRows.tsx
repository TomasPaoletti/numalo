"use client";

import { useState } from "react";
import { Building2, Check, Copy, CreditCard, Hash, Tag, User } from "lucide-react";

import { cn } from "@/lib/utils";

interface BankInfo {
  titular: string | null;
  alias: string | null;
  cbu: string | null;
  cuit: string | null;
  banco: string | null;
}

interface BankDetailRowsProps {
  bankInfo: BankInfo;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors duration-150",
        copied
          ? "bg-[--chart-1]/15 text-[--chart-1]"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
      )}
    >
      {copied ? (
        <>
          <Check size={12} />
          Copiado
        </>
      ) : (
        <>
          <Copy size={12} />
          Copiar
        </>
      )}
    </button>
  );
}

const rowIcon = "text-primary size-4 shrink-0";

export default function BankDetailRows({ bankInfo }: BankDetailRowsProps) {
  const rows: Array<{
    icon: React.ReactNode;
    label: string;
    value: string | null;
    hero?: boolean;
    copyable?: boolean;
  }> = [
    {
      icon: <Tag className={rowIcon} />,
      label: "Alias",
      value: bankInfo.alias,
      hero: true,
      copyable: true,
    },
    {
      icon: <User className={rowIcon} />,
      label: "Titular",
      value: bankInfo.titular,
    },
    {
      icon: <CreditCard className={rowIcon} />,
      label: "CBU",
      value: bankInfo.cbu,
      copyable: true,
    },
    {
      icon: <Hash className={rowIcon} />,
      label: "CUIT",
      value: bankInfo.cuit,
      copyable: true,
    },
    {
      icon: <Building2 className={rowIcon} />,
      label: "Banco",
      value: bankInfo.banco,
    },
  ];

  const visibleRows = rows.filter((r) => r.value);

  if (visibleRows.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        El creador aún no configuró los datos bancarios.
      </p>
    );
  }

  return (
    <div className="divide-border border-border overflow-hidden rounded-lg border divide-y">
      {visibleRows.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-3 bg-background px-4 py-3"
        >
          {row.icon}
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs">{row.label}</p>
            <p
              className={cn(
                "font-mono break-all",
                row.hero ? "text-base font-semibold" : "text-sm"
              )}
            >
              {row.value}
            </p>
          </div>
          {row.copyable && row.value && <CopyButton value={row.value} />}
        </div>
      ))}
    </div>
  );
}
