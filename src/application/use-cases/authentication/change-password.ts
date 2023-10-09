import { UsersRepository } from "@application/repositories/users-repository";
import { MailerService } from "@nestjs-modules/mailer";

import * as bcrypt from 'bcrypt';
import { UserNotFound } from "../errors/user-not-found";

interface Request {
  userId: string;
  newPassword: string;
}




export class ChangePassword {
  constructor(private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository){}
  async execute({userId, newPassword}: Request){

    const user = await this.usersRepository.findById(userId)  

    if(!user){
      throw new UserNotFound();
    }

    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(newPassword, user.salt);
    user.recoverToken = null;
    await this.usersRepository.update(user)  
    
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Senha Alterada",
      template: '/changed-password',
      text: "Este é um teste de envio de email usando Node",
      context: {
          name: user.name 
      }
  })
    
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}