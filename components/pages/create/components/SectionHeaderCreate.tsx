"use client";

import { useCreateContext } from "@/contexts/CreateContext";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const SectionHeaderCreate = () => {
  const {
    currentStep,
    isFirstStep,
    isSecondStep,
    isLastStep,
    loading,
    onSaveDraft,
  } = useCreateContext();

  const description = () => {
    if (isFirstStep) return "Completa la informacion sobre la rifa";
    if (isSecondStep) return "Elige el tipo y la fecha de sorteo";
    return "Revisa que todos los datos esten correctos";
  };

  return (
    <>
      <section
        id="section-header-create"
        className="flex w-full justify-between gap-x-4 pb-4"
      >
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-semibold md:text-4xl">Nueva rifa</h1>
          <p className="text-sm md:text-lg">{description()}</p>
        </div>
        {isLastStep && (
          <Button variant="secondary" disabled={loading} onClick={onSaveDraft}>
            Guardar borrador
          </Button>
        )}
      </section>
      <Progress value={currentStep * 33.33} />
    </>
  );
};
export default SectionHeaderCreate;
