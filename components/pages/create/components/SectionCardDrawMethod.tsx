"use client";

import { Controller, useFormContext } from "react-hook-form";

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

const SectionCardDrawMethod = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipo de sorteo</CardTitle>
        <CardDescription>Cómo se elige al ganador</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Controller
            name="drawMethod"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-full"
              >
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="QUINIELA_NACIONAL" id="quiniela" />
                    <Label
                      htmlFor="quiniela"
                      className="cursor-pointer font-normal"
                    >
                      Quiniela Nacional
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ALEATORIO" id="aleatorio" />
                    <Label
                      htmlFor="aleatorio"
                      className="cursor-pointer font-normal"
                    >
                      Aleatorio (Numeralo)
                    </Label>
                  </div>
                </RadioGroup>

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
export default SectionCardDrawMethod;
