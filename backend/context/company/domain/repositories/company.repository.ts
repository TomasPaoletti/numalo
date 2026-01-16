import { Company } from "@/backend/context/company/domain/entities/company.entity";

export interface CompanyRepository {
  findById(id: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  create(
    companyData: Omit<Company, "id" | "createdAt">,
    userId: string
  ): Promise<Company>;
  update(
    id: string,
    updateData: Partial<Omit<Company, "id" | "createdAt">>
  ): Promise<Company>;
  delete(id: string): Promise<void>;
}
