"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { User } from "@/backend/context/user/domain/entities/user.entity";

import {
  UpdateUserSchema,
  updateUserSchema,
} from "@/components/pages/settings/schemas/update-user.schema";

import UpdateUser from "@/components/pages/settings/services/update-user.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface SectionUserSettingsProps {
  user: User;
}

const SectionUserSettings = ({ user }: SectionUserSettingsProps) => {
  const { email, firstName, lastName } = user;

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email,
      firstName,
      lastName,
    },
  });

  const onSubmit = async (data: UpdateUserSchema) => {
    try {
      setLoading(true);
      await UpdateUser(data);
      toast.success("Datos actualizados");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="section-user-settings">
      <Card>
        <CardHeader>
          <CardTitle>Datos del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-user-settings" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1"
                  >
                    <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1"
                  >
                    <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      aria-invalid={fieldState.invalid}
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-full"
                  >
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      disabled
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            disabled={loading}
            type="submit"
            form="form-user-settings"
            className="ml-auto"
            variant="secondary"
          >
            {loading && <Spinner />}
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};
export default SectionUserSettings;
