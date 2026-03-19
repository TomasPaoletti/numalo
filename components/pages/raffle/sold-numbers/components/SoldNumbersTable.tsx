"use client";

import { Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SoldNumbersTableProps {
  soldNumbers: SoldNumbersEntity[];
  winnerNumber: number | null;
}

const SoldNumbersTable = ({
  soldNumbers,
  winnerNumber,
}: SoldNumbersTableProps) => {
  return (
    <section id="table-sold-numbers" className="hidden md:flex">
      <Table>
        <TableHeader>
          <TableRow className="bg-card">
            <TableHead>Número</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Instagram</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {soldNumbers.map((soldNumber) => {
            const isWinner =
              winnerNumber != null && soldNumber.number === winnerNumber;

            return (
              <TableRow
                key={soldNumber.id}
                className={cn(isWinner && "bg-primary/10")}
              >
                <TableCell className="flex items-center gap-x-2 font-medium">
                  {isWinner && <Trophy className="text-amber-300" size={16} />}
                  {soldNumber.number}
                </TableCell>
                <TableCell>{soldNumber.payment?.payerName ?? "—"}</TableCell>
                <TableCell>
                  {soldNumber.payment?.payerEmail ? (
                    <a
                      href={`mailto:${soldNumber.payment.payerEmail}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {soldNumber.payment.payerEmail}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {soldNumber.payment?.payerPhone ? (
                    <a
                      href={`https://wa.me/${soldNumber.payment.payerPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {soldNumber.payment.payerPhone}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {soldNumber.payment?.payerInstagram ? (
                    <a
                      href={`https://instagram.com/${soldNumber.payment.payerInstagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {soldNumber.payment.payerInstagram}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};
export default SoldNumbersTable;
