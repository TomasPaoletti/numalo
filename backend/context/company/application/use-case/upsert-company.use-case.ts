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

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ValidationError("Usuario no encontrado");
    }

    let company;

    const dataCompany = {
      name,
      image: image ?? null,
      phone: phone ?? null,
      mpAccessToken: mpAccessToken ?? null,
      mpRefreshToken: mpRefreshToken ?? null,
      mpTokenExpiresAt: mpTokenExpiresAt ?? null,
      mpUserId: mpUserId ?? null,
    };

    if (user.companyId) {
      company = await this.companyRepository.update(
        user.companyId,
        dataCompany
      );
    } else {
      company = await this.companyRepository.create(dataCompany, userId);
    }

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
