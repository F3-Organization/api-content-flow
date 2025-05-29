import { DomainException } from "@/domain/error";

export class Email {
  constructor(private email: string) {
    this.validateEmail();
  }

  private validateEmail() {
    const emailPattern = new RegExp(
      "^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$"
    );
    if (!emailPattern.test(this.email)) {
      throw new DomainException("Invalid email format");
    }
  }

  get getValue() {
    return this.email;
  }
}
