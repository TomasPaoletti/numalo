"use client";

import { Controller, useFormContext } from "react-hook-form";

import { DrawTrigger } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputDrawDate from "./InputDrawDate";

const SectionCardDrawTrigger = () => {
  const { control, watch, setValue, trigger } = useFormContext();

  const drawTriggerValue = watch("drawTrigger");
  const showDatePicker = drawTriggerValue === DrawTrigger.FECHA_FIJA;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Fecha de sorteo</CardTitle>
        <CardDescription>Cuándo se elige al ganador</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Controller
            name="drawTrigger"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-full"
              >
                <RadioGroup
                  value={field.value}
                  onValueChange={async (value) => {
                    field.onChange(value);
                    if (value === DrawTrigger.VENDER_TODO) {
                      setValue("drawDate", undefined);
                      await trigger("drawDate");
                    }
                  }}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={DrawTrigger.VENDER_TODO} id="all" />
                    <Label htmlFor="all" className="cursor-pointer font-normal">
                      Al vender todos los números
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={DrawTrigger.FECHA_FIJA} id="date" />
                    <Label
                      htmlFor="date"
                      className="cursor-pointer font-normal"
                    >
                      Fecha fija
                    </Label>
                  </div>
                </RadioGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {showDatePicker && (
            <Controller
              name="drawDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-full"
                >
                  <InputDrawDate
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
export default SectionCardDrawTrigger;
