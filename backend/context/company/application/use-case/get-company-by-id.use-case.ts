import {
  CompanyResponseDto,
  GetCompanyDto,
} from "@/backend/context/company/application/dto";

import { CompanyRepository } from "@/backend/context/company/domain/repositories/company.repository";

import { NotFoundError, ValidationError } from "@/backend/shared/errors";

export class GetCompanyByIdUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(data: GetCompanyDto): Promise<CompanyResponseDto> {
    const { id } = data;

    if (!id) {
      throw new ValidationError("El ID de la compañía es requerido");
    }

    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundError("Compañía no encontrada");
    }

    return {
      id: company.id,
      name: company.name,
      image: company.image,
      phone: company.phone,
      createdAt: company.createdAt,
    };
  }
}
