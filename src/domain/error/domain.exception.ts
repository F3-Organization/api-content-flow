import { HttpStatus } from "@/infra/http/protocols.enum";

export class DomainException extends Error {
  readonly statusCode?: number;
  constructor(message: string, status?: HttpStatus) {
    super(message);
    this.name = "DomainException";
    this.statusCode = status;
  }
}
