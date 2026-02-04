"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useRef, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { DrawMethod, DrawTrigger } from "@/types";

import {
  createSchema,
  CreateSchemaInput,
} from "@/components/pages/create/schemas/create.schema";
import CreateRaffle from "@/components/pages/create/services/create-raffle.service";

interface CreateContextType {
  methods: UseFormReturn<CreateSchemaInput>;
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isSecondStep: boolean;
  isLastStep: boolean;
  isNextStepDisabled: boolean;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  loading: boolean;
  nextStep: () => void;
  prevStep: () => void;
  setImagePreview: (preview: string | null) => void;
  removeImage: () => Promise<void>;
  onSubmit: (data: CreateSchemaInput) => void;
}

const CreateContext = createContext<CreateContextType | undefined>(undefined);

const STEP_1_REQUERIED = ["title", "totalNumbers", "numberPrice"] as const;

const STEP_1_OPTIONAL = [
  "description",
  "hasQuantityDiscount",
  "quantity",
  "percentage",
  "image",
] as const;

export function CreateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const totalSteps = 3;

  const methods = useForm<CreateSchemaInput>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: "",
      totalNumbers: undefined,
      numberPrice: undefined,
      description: "",
      hasQuantityDiscount: false,
      quantity: undefined,
      percentage: undefined,
      image: undefined,
      drawMethod: DrawMethod.QUINIELA_NACIONAL,
      drawTrigger: DrawTrigger.AL_VENDER_TODO,
      drawDate: undefined,
    },
    mode: "onTouched",
  });

  const { setValue, trigger, watch, formState } = methods;

  const { errors } = formState;

  const hasStep1Errors =
    STEP_1_REQUERIED.some((field) => errors[field]) ||
    STEP_1_OPTIONAL.some((field) => errors[field]);

  const isStep1Complete = STEP_1_REQUERIED.every((field) => {
    const value = watch(field);
    return value !== undefined && value !== "" && value !== null;
  });

  const isFirstStep = currentStep === 1;
  const isSecondStep = currentStep === 2;
  const isLastStep = currentStep === totalSteps;

  const isNextStepDisabled = !isStep1Complete || hasStep1Errors;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const removeImage = async () => {
    setValue("image", undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    await trigger("image");
    setImagePreview(null);
  };

  const onSubmit = async (data: CreateSchemaInput) => {
    try {
      setLoading(true);
      await CreateRaffle(data);

      toast.success("Rifa creada exitosamente");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateContext.Provider
      value={{
        methods,
        currentStep,
        totalSteps,
        isFirstStep,
        isSecondStep,
        isLastStep,
        imagePreview,
        fileInputRef,
        isNextStepDisabled,
        loading,
        nextStep,
        prevStep,
        setImagePreview,
        removeImage,
        onSubmit,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateContext.Provider>
  );
}

export function useCreateContext() {
  const context = useContext(CreateContext);

  if (!context) {
    throw new Error(
      "useCreateContext must be used within CreateContextProvider"
    );
  }

  return context;
}
