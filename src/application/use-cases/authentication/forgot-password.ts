import { UsersRepository } from "@application/repositories/users-repository";
import { MailerService } from "@nestjs-modules/mailer";
import { NotFoundException } from "@nestjs/common";
import * as crypto from 'crypto';
interface Request {
  email: string
}
export class ForgotPassword {
  constructor(private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository){}
  async execute({email}: Request){
    const user = await this.usersRepository.findByEmail(email)

    if(!user){
      throw new NotFoundException('Não há usuário cadastrado com esse email.');
    }

    user.recoverToken = crypto.randomBytes(32).toString('hex');

    await this.usersRepository.update(user)
    
    await this.mailerService.sendMail({
      to: email,
      subject: "Redefinição de senha",
      template: '/password-recover',
      text: "Este é um teste de envio de email usando Node",
      context: {
          name: user.name,
          urlFront: `${process.env.FRONT_WEB_URL}`,
          email: user.email,
          recoverToken: user.recoverToken
      }
  })
    
  }
}