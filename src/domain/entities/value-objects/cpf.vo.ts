import { DomainException } from "@/domain/error";

export class CPF {
  private readonly value: string;

  constructor(value: string) {
    if (!CPF.isValid(value)) {
      throw new DomainException("CPF inválido");
    }
    this.value = CPF.clean(value);
  }

  static clean(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  static isValid(cpf: string): boolean {
    cpf = CPF.clean(cpf);
    if (!this.compareInvalids(cpf)) return false;
    let sum = 0;
    let rest;
    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  static compareInvalids(cpf: string) {
    if (
      !cpf ||
      cpf.length !== 11 ||
      cpf === "00000000000" ||
      cpf === "11111111111" ||
      cpf === "22222222222" ||
      cpf === "33333333333" ||
      cpf === "44444444444" ||
      cpf === "55555555555" ||
      cpf === "66666666666" ||
      cpf === "77777777777" ||
      cpf === "88888888888" ||
      cpf === "99999999999"
    ) {
      return false;
    }
    return true;
  }

  toString(): string {
    return this.value;
  }

  equals(other: CPF): boolean {
    return this.value === other.value;
  }
}
