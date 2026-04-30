import { UserRepository } from './repo.js';
import { EmailSender } from './emailSender.js';
import { normalizeEmail } from './util.js';

export class LoginService {
  constructor(private repo: UserRepository, private emailSender: EmailSender) {}
  async login(email: string): Promise<boolean> {
    const user = await this.repo.findByEmail(normalizeEmail(email));
    if (!user) return false;
    await this.repo.saveLogin(user.id);
    await this.emailSender.sendLoginNotice(user.email);
    return this.isAllowed(user.id);
  }
  private isAllowed(userId: string): boolean { return userId.length > 0; }
}
