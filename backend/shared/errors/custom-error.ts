export class CustomError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
