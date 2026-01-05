export interface UserProps {
  id: string;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  companyId?: string | null;
  company?: any | null;
}

export class User {
  id: string;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  companyId?: string | null;
  company?: any | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.companyId = props.companyId;
    this.company = props.company;
  }

  static create(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    password?: string | null,
    companyId?: string | null,
    company?: any | null
  ): User {
    return new User({
      id,
      email,
      password,
      firstName,
      lastName,
      createdAt,
      updatedAt,
      companyId,
      company,
    });
  }
}
