"use client";

import { useCreateContext } from "@/contexts/CreateContext";

import { cn } from "@/lib/utils";

import SectionCardDrawMethod from "./SectionCardDrawMethod";
import SectionCardInfoBasic from "./SectionCardInfoBasic";
import SectionCardInfoOptional from "./SectionCardInfoOptional";

const SectionFormCreate = () => {
  const { methods, onSubmit, isFirstStep, isLastStep } = useCreateContext();

  return (
    <form id="create-form" onSubmit={methods.handleSubmit(onSubmit)}>
      <div
        className={cn(
          "flex flex-col gap-y-4 pt-8 transition-all duration-300 lg:gap-y-6",
          isLastStep && "hidden"
        )}
      >
        <SectionCardInfoBasic />
        <SectionCardInfoOptional />
      </div>
      <div
        className={cn(
          "flex flex-col gap-y-4 pt-8 transition-all duration-300 lg:gap-y-6",
          isFirstStep && "hidden"
        )}
      >
        <SectionCardDrawMethod />
      </div>
    </form>
  );
};
export default SectionFormCreate;
