export class DomainException extends Error {
  readonly statusCode?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "DomainException";
    this.statusCode = status;
  }
}
