import {
  CompanyResponseDto,
  UpdateCompanyDto,
} from "@/backend/context/company/application/dto";

import { CompanyRepository } from "@/backend/context/company/domain/repositories/company.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class UpdateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(
    id: string,
    data: UpdateCompanyDto
  ): Promise<CompanyResponseDto> {
    if (!id) {
      throw new ValidationError("El ID de la compañía es requerido");
    }

    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new NotFoundError("Compañía no encontrada");
    }

    const company = await this.companyRepository.update(id, data);

    return {
      id: company.id,
      name: company.name,
      image: company.image,
      phone: company.phone,
      createdAt: company.createdAt,
    };
  }
}
