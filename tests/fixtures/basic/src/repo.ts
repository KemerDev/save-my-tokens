export interface User { id: string; email: string; passwordHash: string }
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> { return { id: 'u1', email, passwordHash: 'hash' }; }
  async saveLogin(userId: string): Promise<void> { void userId; }
}
