export interface UserDAO {
  createUser(user: any, auth: any): Promise<void>;
}
