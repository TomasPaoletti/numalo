"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCreateContext } from "@/contexts/CreateContext";

const SectionHeaderCreate = () => {
  const { currentStep } = useCreateContext();

  return (
    <>
      <section
        id="section-header-create"
        className="flex w-full justify-between gap-x-4 pb-4"
      >
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-semibold md:text-4xl">Nueva rifa</h1>
          <p className="text-sm md:text-lg">
            Completa la informacion sobre la rifa
          </p>
        </div>
        <Button variant="secondary">Guardar borrador</Button>
      </section>
      <Progress value={currentStep * 50} />
    </>
  );
};
export default SectionHeaderCreate;
