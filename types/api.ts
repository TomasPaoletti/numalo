export interface ApiError {
  message: string;
  statusCode: number;
}

export interface ErrorState extends ApiError {
  type: "validation" | "conflict" | "server" | "network";
}

export class ApiErrorWithDetails extends Error {
  public readonly apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiErrorWithDetails";
    this.apiError = apiError;

    Object.setPrototypeOf(this, ApiErrorWithDetails.prototype);
  }
}
