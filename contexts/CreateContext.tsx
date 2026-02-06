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

import { CallPaymentPreference } from "@/lib/payment";

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
  onSaveDraft: () => Promise<void>;
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
      drawTrigger: DrawTrigger.VENDER_TODO,
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
      toast.loading("Creando rifa");
      const raffle = await CreateRaffle(data);
      toast.success("Rifa creada exitosamente");

      await handlePay(raffle.id);
    } catch (error: any) {
      console.error(error.message);
      toast.dismiss();
      toast.error("Hubo un problema al crear la rifa. Intente nuevamente");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (raffleId: string) => {
    try {
      toast.loading("Preparando pago");
      console.log(raffleId);
      await CallPaymentPreference(raffleId);
    } catch (error: any) {
      toast.dismiss();
      toast.error("Error al procesar el pago. Intentalo mas tarde");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = async () => {
    const data = methods.getValues();

    toast.loading("Guardando borrador");
    try {
      setLoading(true);
      await CreateRaffle(data);
      toast.dismiss();
      toast.success("Borrador guardado exitosamente");
      router.push("/admin");
    } catch (error: any) {
      console.error(error.message);
      toast.dismiss();
      toast.error("Hubo un problema al guardar el borrador");
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
        onSaveDraft,
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
