"use client";

import { useCreateContext } from "@/contexts/CreateContext";

import { Button } from "@/components/ui/button";

const SectionFooterCreate = () => {
  const { isFirstStep, isLastStep, nextStep, prevStep, isNextStepDisabled } =
    useCreateContext();

  return (
    <section
      id="section-footer-create"
      className="flex w-full justify-end gap-x-4 pt-4 md:pt-6"
    >
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            prevStep();
          }}
          className="flex-1 sm:flex-none"
        >
          Anterior
        </Button>
      )}

      {!isLastStep ? (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            nextStep();
          }}
          disabled={isNextStepDisabled}
          className="flex-1 sm:flex-none"
        >
          Siguiente
        </Button>
      ) : (
        <Button
          type="submit"
          form="create-form"
          className="flex-1 sm:flex-none"
        >
          Crear rifa
        </Button>
      )}
    </section>
  );
};

export default SectionFooterCreate;
