export interface IUserDAO {
  createUser(user: any, auth: any): Promise<void>;
  getByEmail(email: string): Promise<any>;
}
