"use client";

import {
  createSchema,
  CreateSchemaInput,
} from "@/components/pages/create/schemas/create.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useRef, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

interface CreateContextType {
  methods: UseFormReturn<CreateSchemaInput>;

  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;

  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  removeImage: () => Promise<void>;

  onSubmit: (data: CreateSchemaInput) => void;
}

const CreateContext = createContext<CreateContextType | undefined>(undefined);

export function CreateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 2;

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
    },
    mode: "onTouched",
  });

  const { setValue, trigger } = methods;

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

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const removeImage = async () => {
    setValue("image", undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    await trigger("image");
    setImagePreview(null);
  };

  const onSubmit = (data: CreateSchemaInput) => {
    console.log("Form data:", data);
  };

  return (
    <CreateContext.Provider
      value={{
        methods,
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,
        imagePreview,
        setImagePreview,
        fileInputRef,
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
