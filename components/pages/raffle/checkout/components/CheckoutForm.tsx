"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  CheckoutSchema,
  checkoutSchema,
} from "@/components/pages/raffle/checkout/schema/checkout.schema";

import CheckoutReturnDialog from "@/components/pages/raffle/checkout/components/CheckoutReturnDialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [returnDialog, setReturnDialog] = useState(false);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      instagram: "",
    },
  });

  const handleReturnDialog = () => {
    setReturnDialog((prevState) => !prevState);
  };

  const onSubmit = async (data: CheckoutSchema) => {
    try {
      setLoading(true);
      console.log(data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Titulo</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      autoComplete="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="johndoe@gmail.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Número de telefono</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="1143211234"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="instagram"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between gap-x-2">
                      <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
                      <p className="text-muted-foreground text-xs italic">
                        Opcional
                      </p>
                    </div>
                    <Input
                      {...field}
                      id="instagram"
                      type="text"
                      autoComplete="instagram"
                      aria-invalid={fieldState.invalid}
                      placeholder="@usuario"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center gap-y-2">
        <Button
          disabled={loading}
          type="submit"
          form="checkout-form"
          className="w-fit"
        >
          Confirmar y pagar
        </Button>
        <Button variant="link" className="w-fit" onClick={handleReturnDialog}>
          Volver/Editar números
        </Button>
      </div>
      <CheckoutReturnDialog
        open={returnDialog}
        handleReturnDialog={handleReturnDialog}
      />
    </>
  );
};
export default CheckoutForm;
