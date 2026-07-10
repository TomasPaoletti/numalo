import {
  CompanyResponseDto,
  CreateCompanyDto,
} from "@/backend/context/company/application/dto";

import { CompanyRepository } from "@/backend/context/company/domain/repositories/company.repository";

import { ValidationError } from "@/backend/shared/errors";

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(
    data: CreateCompanyDto,
    userId: string
  ): Promise<CompanyResponseDto> {
    const {
      name,
      image,
      phone,
      titular,
      alias,
      cbu,
      cuit,
      banco,
      canCreateFreeRaffle,
    } = data;

    if (!name) {
      throw new ValidationError("El nombre de la compañía es requerido");
    }

    return await this.companyRepository.create(
      {
        name,
        image: image ?? null,
        phone: phone ?? null,
        titular: titular ?? null,
        alias: alias ?? null,
        cbu: cbu ?? null,
        cuit: cuit ?? null,
        banco: banco ?? null,
        canCreateFreeRaffle: canCreateFreeRaffle ?? true,
      },
      userId
    );
  }
}
