"use client";

import { useCreateContext } from "@/contexts/CreateContext";

import { cn } from "@/lib/utils";

import SectionCardDrawMethod from "./SectionCardDrawMethod";
import SectionCardDrawTrigger from "./SectionCardDrawTrigger";
import SectionCardInfoBasic from "./SectionCardInfoBasic";
import SectionCardInfoOptional from "./SectionCardInfoOptional";
import SectionFooterCreate from "./SectionFooterCreate";
import SectionResumeCreate from "./SectionResumeCreate";

const SectionFormCreate = () => {
  const { methods, onSubmit, isFirstStep, isSecondStep, isLastStep } =
    useCreateContext();

  return (
    <form id="create-form" onSubmit={methods.handleSubmit(onSubmit)}>
      <div
        className={cn(
          "flex flex-col gap-y-4 pt-8 transition-all duration-300 lg:gap-y-6",
          !isFirstStep && "hidden"
        )}
      >
        <SectionCardInfoBasic />
        <SectionCardInfoOptional />
      </div>
      <div
        className={cn(
          "flex flex-col gap-y-4 pt-8 transition-all duration-300 lg:gap-y-6",
          !isSecondStep && "hidden"
        )}
      >
        <SectionCardDrawMethod />
        <SectionCardDrawTrigger />
      </div>
      <div
        className={cn(
          "flex flex-col gap-y-4 pt-8 transition-all duration-300 lg:gap-y-6",
          !isLastStep && "hidden"
        )}
      >
        <SectionResumeCreate />
      </div>
      <SectionFooterCreate />
    </form>
  );
};
export default SectionFormCreate;
