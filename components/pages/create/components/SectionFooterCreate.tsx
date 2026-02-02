"use client";

import { Button } from "@/components/ui/button";
import { useCreateContext } from "@/contexts/CreateContext";

const SectionFooterCreate = () => {
  const { isFirstStep, isLastStep, nextStep, prevStep } = useCreateContext();

  return (
    <section
      id="section-footer-create"
      className="flex w-full justify-end gap-x-4 pt-4 md:pt-6"
    >
      {!isFirstStep && (
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
      )}

      {!isLastStep ? (
        <Button onClick={nextStep}>Siguiente</Button>
      ) : (
        <Button type="submit" form="create-form">
          Crear rifa
        </Button>
      )}
    </section>
  );
};
export default SectionFooterCreate;
