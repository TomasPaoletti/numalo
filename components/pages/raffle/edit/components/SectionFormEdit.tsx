"use client";

import { useEditContext } from "@/contexts/EditContext";

import { cn } from "@/lib/utils";

import SectionCardDrawMethod from "@/components/pages/create/components/SectionCardDrawMethod";
import SectionCardDrawTrigger from "@/components/pages/create/components/SectionCardDrawTrigger";
import SectionCardInfoBasic from "@/components/pages/create/components/SectionCardInfoBasic";
import SectionResumeCreate from "@/components/pages/create/components/SectionResumeCreate";
import SectionCardInfoOptionalEdit from "@/components/pages/raffle/edit/components/SectionCardInfoOptionalEdit";
import SectionFooterEdit from "@/components/pages/raffle/edit/components/SectionFooterEdit";

const SectionFormEdit = () => {
  const { methods, onSubmit, isFirstStep, isSecondStep, isLastStep } =
    useEditContext();

  return (
    <form id="edit-form" onSubmit={methods.handleSubmit(onSubmit)}>
      <div
        className={cn(
          "flex flex-col gap-y-4 pt-8 transition-all duration-300 lg:gap-y-6",
          !isFirstStep && "hidden"
        )}
      >
        <SectionCardInfoBasic />
        <SectionCardInfoOptionalEdit />
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
      <SectionFooterEdit />
    </form>
  );
};
export default SectionFormEdit;
