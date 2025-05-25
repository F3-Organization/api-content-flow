export enum userRoleEnum {
  "admin" = 1,
  "member" = 2,
}

export class UserRole {
  constructor(readonly role: userRoleEnum) {}

  get getRoleValue() {
    return userRoleEnum[this.role];
  }

  get getRole() {
    return this.role;
  }
}
