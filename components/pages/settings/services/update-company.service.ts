import { UpsertCompanyDto } from "@/backend/context/company/application/dto";
import { Company } from "@/backend/context/company/domain/entities/company.entity";

import { apiClient } from "@/lib/api";

const UpsertCompany = async (data: UpsertCompanyDto): Promise<Company> => {
  return apiClient.put<Company>("/api/company", data);
};

export default UpsertCompany;
