"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useRef, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";
import { DrawMethod, DrawTrigger } from "@/types";

import {
  createSchema,
  CreateSchemaInput,
} from "@/components/pages/create/schemas/create.schema";

import UpdateRaffle from "@/components/pages/raffle/edit/services/update-raffle.service";

import { CallPaymentPreference } from "@/lib/payment";

interface EditContextType {
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

const EditContext = createContext<EditContextType | undefined>(undefined);

const STEP_1_REQUIRED = ["title", "totalNumbers", "numberPrice"] as const;

const STEP_1_OPTIONAL = [
  "description",
  "hasQuantityDiscount",
  "quantity",
  "percentage",
  "image",
] as const;

export function EditContextProvider({
  children,
  raffle,
}: {
  children: React.ReactNode;
  raffle: RaffleEntity;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(
    raffle.image || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const totalSteps = 3;

  const methods = useForm<CreateSchemaInput>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: raffle.title,
      totalNumbers: raffle.totalNumbers,
      numberPrice: raffle.numberPrice,
      description: raffle.description || "",
      hasQuantityDiscount: raffle.hasQuantityDiscount,
      quantity: raffle.quantityDiscounts?.[0]?.quantity,
      percentage: raffle.quantityDiscounts?.[0]?.percentage,
      image: undefined,
      drawMethod: raffle.drawMethod as DrawMethod,
      drawTrigger: raffle.drawTrigger as DrawTrigger,
      drawDate: raffle.drawDate ? new Date(raffle.drawDate) : undefined,
    },
    mode: "onTouched",
  });

  const { setValue, trigger, watch, formState } = methods;

  const { errors } = formState;

  const hasStep1Errors =
    STEP_1_REQUIRED.some((field) => errors[field]) ||
    STEP_1_OPTIONAL.some((field) => errors[field]);

  const isStep1Complete = STEP_1_REQUIRED.every((field) => {
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
      toast.loading("Actualizando rifa");
      await UpdateRaffle(raffle.id, data, imagePreview);
      toast.success("Rifa actualizada exitosamente");

      await handlePay(raffle.id);
    } catch (error: any) {
      console.error(error.message);
      toast.dismiss();
      toast.error("Hubo un problema al actualizar la rifa");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (raffleId: string) => {
    try {
      toast.loading("Preparando pago");
      await CallPaymentPreference(raffleId);
    } catch (error: any) {
      toast.dismiss();
      toast.error("Error al procesar el pago");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = async () => {
    const data = methods.getValues();

    toast.loading("Guardando cambios");
    try {
      setLoading(true);
      await UpdateRaffle(raffle.id, data, imagePreview);
      toast.dismiss();
      toast.success("Cambios guardados exitosamente");
      router.push("/admin");
    } catch (error: any) {
      console.error(error.message);
      toast.dismiss();
      toast.error("Hubo un problema al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditContext.Provider
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
    </EditContext.Provider>
  );
}

export function useEditContext() {
  const context = useContext(EditContext);

  if (!context) {
    throw new Error("useEditContext must be used within EditContextProvider");
  }

  return context;
}
