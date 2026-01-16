"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Company } from "@/backend/context/company/domain/entities/company.entity";

import {
  UpdateCompanySchema,
  updateCompanySchema,
} from "@/components/pages/settings/schemas/update-company.schema";
import UpsertCompany from "@/components/pages/settings/services/update-company.service";

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

interface SectionCompanySettingsProps {
  company?: Company;
}

const SectionCompanySettings = ({ company }: SectionCompanySettingsProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { update } = useSession();
  const router = useRouter();

  const form = useForm<UpdateCompanySchema>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company?.name ?? "",
      phone: company?.phone ?? "",
    },
  });

  const onSubmit = async (data: UpdateCompanySchema) => {
    try {
      setLoading(true);
      const company = await UpsertCompany(data);
      await update({
        companyId: company.id,
      });

      toast.success("Datos guardados");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="section-company-settings">
      <Card>
        <CardHeader>
          <CardTitle>Datos de tu compañia</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="form-company-settings"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1"
                  >
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1"
                  >
                    <FieldLabel htmlFor="phone">Numero de telefono</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      aria-invalid={fieldState.invalid}
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
        <CardFooter>
          <Button
            disabled={loading}
            type="submit"
            form="form-company-settings"
            className="ml-auto"
          >
            {loading && <Spinner />}
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};
export default SectionCompanySettings;
