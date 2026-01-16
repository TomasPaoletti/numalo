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
    const { name, image, phone } = data;

    if (!name) {
      throw new ValidationError("El nombre de la compañía es requerido");
    }

    const company = await this.companyRepository.create(
      {
        name,
        image: image ?? null,
        phone: phone ?? null,
      },
      userId
    );

    return {
      id: company.id,
      name: company.name,
      image: company.image,
      phone: company.phone,
      createdAt: company.createdAt,
    };
  }
}
