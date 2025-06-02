export interface UserDAO {
  createUser(user: any, auth: any): Promise<void>;
  getByEmail(email: string): Promise<any>;
}
