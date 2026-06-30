import {
  CompanyResponseDto,
  UpsertCompanyDto,
} from "@/backend/context/company/application/dto";

import { CompanyRepository } from "@/backend/context/company/domain/repositories/company.repository";
import { UserRepository } from "@/backend/context/user/domain/repositories/user.repository";

import { ValidationError } from "@/backend/shared/errors";

export class UpsertCompanyUseCase {
  constructor(
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    userId: string,
    data: UpsertCompanyDto
  ): Promise<CompanyResponseDto> {
    const { name, image, phone, titular, alias, cbu, cuit, banco, canCreateFreeRaffle } = data;

    if (!name) {
      throw new ValidationError("El nombre de la compañía es requerido");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ValidationError("Usuario no encontrado");
    }

    const dataCompany = {
      name,
      image: image ?? null,
      phone: phone ?? null,
      titular: titular ?? null,
      alias: alias ?? null,
      cbu: cbu ?? null,
      cuit: cuit ?? null,
      banco: banco ?? null,
      canCreateFreeRaffle: canCreateFreeRaffle ?? false,
    };

    let company;

    if (user.companyId) {
      company = await this.companyRepository.update(user.companyId, dataCompany);
    } else {
      company = await this.companyRepository.create(dataCompany, userId);
    }

    return {
      id: company.id,
      name: company.name,
      image: company.image,
      phone: company.phone,
      titular: company.titular,
      alias: company.alias,
      cbu: company.cbu,
      cuit: company.cuit,
      banco: company.banco,
      canCreateFreeRaffle: company.canCreateFreeRaffle,
      createdAt: company.createdAt,
    };
  }
}
