"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const SectionCardInfoBasic = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Información básica</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-3">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-2 lg:col-span-1"
              >
                <FieldLabel htmlFor="title">Titulo</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  type="text"
                  autoComplete="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Gran rifa fin de año"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="totalNumbers"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-1">
                <FieldLabel htmlFor="totalNumbers">
                  Cantidad de números
                </FieldLabel>
                <Input
                  {...field}
                  id="totalNumbers"
                  type="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="Entre 100 y 1000"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="numberPrice"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-1">
                <FieldLabel htmlFor="numberPrice">Precio por número</FieldLabel>
                <Input
                  {...field}
                  id="numberPrice"
                  type="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="1000$"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

export default SectionCardInfoBasic;
