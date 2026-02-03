"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

import { useCreateContext } from "@/contexts/CreateContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const SectionCardInfoOptional = () => {
  const { fileInputRef, removeImage, setImagePreview, imagePreview } =
    useCreateContext();

  const { control, setValue, watch, trigger } = useFormContext();

  const hasQuantityDiscountValue = watch("hasQuantityDiscount");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Información adicional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-1">
                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Brindá mas información sobre tu rifa"
                />
              </Field>
            )}
          />
          <div className="col-span-1 grid grid-cols-4 gap-4 lg:gap-y-2">
            <Controller
              name="hasQuantityDiscount"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal" className="col-span-4 w-fit">
                  <FieldLabel htmlFor="hasQuantityDiscount">
                    Descuento compra por cantidad
                  </FieldLabel>
                  <Switch
                    id="hasQuantityDiscount"
                    checked={field.value}
                    onCheckedChange={async (checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        setValue("quantity", undefined);
                        setValue("percentage", undefined);

                        await trigger("quantity");
                        await trigger("percentage");
                      }
                    }}
                  />
                </Field>
              )}
            />

            <Controller
              name="quantity"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-disabled
                  className="col-span-2"
                >
                  <FieldLabel htmlFor="quantity">Números comprados</FieldLabel>
                  <Input
                    {...field}
                    id="quantity"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="2"
                    value={field.value ?? ""}
                    disabled={!hasQuantityDiscountValue}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="percentage"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor="percentage">% de descuento</FieldLabel>
                  <Input
                    {...field}
                    id="percentage"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="5%"
                    value={field.value ?? ""}
                    disabled={!hasQuantityDiscountValue}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="image"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-full"
              >
                <FieldLabel htmlFor="image">Imagen</FieldLabel>
                <Input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  aria-invalid={fieldState.invalid}
                  placeholder="Subir foto"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      await trigger("image");
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {imagePreview && (
          <div className="mt-4">
            <div className="relative size-24 overflow-hidden rounded-lg border">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  removeImage();
                }}
                className="bg-primary hover:bg-chart-5 absolute top-1 right-1 rounded-full p-1 transition-colors"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionCardInfoOptional;
