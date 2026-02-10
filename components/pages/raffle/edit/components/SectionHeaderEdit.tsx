"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { useEditContext } from "@/contexts/EditContext";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const SectionHeaderEdit = () => {
  const { currentStep, loading, onSaveDraft } = useEditContext();

  return (
    <>
      <section
        id="section-header-edit"
        className="flex w-full flex-col items-start gap-2"
      >
        <Button variant="link" asChild className="px-0">
          <Link href="/admin">
            <ChevronLeft />
            Volver
          </Link>
        </Button>
        <div className="flex w-full justify-between gap-x-4 pb-4">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold md:text-4xl">Editar rifa</h1>
          </div>

          <Button variant="secondary" disabled={loading} onClick={onSaveDraft}>
            Guardar borrador
          </Button>
        </div>
      </section>
      <Progress value={currentStep * 33.33} />
    </>
  );
};
export default SectionHeaderEdit;
