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
      mpAccessToken,
      mpRefreshToken,
      mpTokenExpiresAt,
      mpUserId,
    } = data;

    if (!name) {
      throw new ValidationError("El nombre de la compañía es requerido");
    }

    const company = await this.companyRepository.create(
      {
        name,
        image: image ?? null,
        phone: phone ?? null,
        mpAccessToken: mpAccessToken ?? null,
        mpRefreshToken: mpRefreshToken ?? null,
        mpTokenExpiresAt: mpTokenExpiresAt ?? null,
        mpUserId: mpUserId ?? null,
      },
      userId
    );

    return {
      id: company.id,
      name: company.name,
      image: company.image,
      phone: company.phone,
      mpAccessToken: company.mpAccessToken,
      mpRefreshToken: company.mpRefreshToken,
      mpTokenExpiresAt: company.mpTokenExpiresAt,
      mpUserId: company.mpUserId,
      createdAt: company.createdAt,
    };
  }
}
