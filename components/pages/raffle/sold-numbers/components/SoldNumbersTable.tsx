"use client";

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
}

const SoldNumbersTable = ({ soldNumbers }: SoldNumbersTableProps) => {
  return (
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
        {soldNumbers.map((soldNumber) => (
          <TableRow key={soldNumber.id}>
            <TableCell className="font-medium">{soldNumber.number}</TableCell>
            <TableCell>{soldNumber.payment?.payerName ?? "—"}</TableCell>
            <TableCell>{soldNumber.payment?.payerEmail ?? "—"}</TableCell>
            <TableCell>{soldNumber.payment?.payerPhone ?? "—"}</TableCell>
            <TableCell>
              {soldNumber.payment?.payerInstagram
                ? soldNumber.payment.payerInstagram
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default SoldNumbersTable;
