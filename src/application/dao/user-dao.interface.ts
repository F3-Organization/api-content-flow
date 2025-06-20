export interface IUserDAO {
  save(user: any, auth: any): Promise<void>;
  getById(id: string): Promise<any>;
  getByEmail(email: string): Promise<any>;
  saveFromGoogle(user: any): Promise<void>;
}
