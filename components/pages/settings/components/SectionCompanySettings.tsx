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
  CardDescription,
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
      titular: company?.titular ?? "",
      alias: company?.alias ?? "",
      cbu: company?.cbu ?? "",
      cuit: company?.cuit ?? "",
      banco: company?.banco ?? "",
    },
  });

  const onSubmit = async (data: UpdateCompanySchema) => {
    try {
      setLoading(true);
      const updated = await UpsertCompany({
        ...data,
        titular: data.titular || null,
        alias: data.alias || null,
        cbu: data.cbu || null,
        cuit: data.cuit || null,
        banco: data.banco || null,
      });
      await update({ companyId: updated.id });

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
          <CardDescription>
            Agrega un nombre y un telefono para la que los compradores sepan de
            quien es la rifa
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-6">
          <form
            id="form-company-settings"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-1">
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input {...field} id="name" aria-invalid={fieldState.invalid} />
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
                  <Field data-invalid={fieldState.invalid} className="col-span-1">
                    <FieldLabel htmlFor="phone">Número de teléfono</FieldLabel>
                    <Input {...field} id="phone" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="mt-6 border-t pt-6">
              <p className="text-sm font-medium mb-3">Datos para transferencia</p>
              <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Controller
                  name="titular"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1 sm:col-span-2">
                      <FieldLabel htmlFor="titular">Titular de la cuenta</FieldLabel>
                      <Input
                        {...field}
                        id="titular"
                        placeholder="Juan García"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="alias"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel htmlFor="alias">
                        Alias{" "}
                        <span className="text-muted-foreground font-normal text-xs">(requerido si no hay CBU)</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="alias"
                        placeholder="juan.garcia.mp"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="cbu"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel htmlFor="cbu">
                        CBU{" "}
                        <span className="text-muted-foreground font-normal text-xs">(requerido si no hay Alias)</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="cbu"
                        placeholder="0000003100012345678901"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="banco"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel htmlFor="banco">
                        Banco{" "}
                        <span className="text-muted-foreground font-normal text-xs">Opcional</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="banco"
                        placeholder="Banco Galicia"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="cuit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel htmlFor="cuit">
                        CUIT / CUIL{" "}
                        <span className="text-muted-foreground font-normal text-xs">Opcional</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="cuit"
                        placeholder="20-12345678-9"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            disabled={loading}
            type="submit"
            form="form-company-settings"
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
export default SectionCompanySettings;
