import { UsersRepository } from "@application/repositories/users-repository";
import { MailerService } from "@nestjs-modules/mailer";
interface Request {
  userId: string
  password: string
}
export class ResetPassword {
  constructor(private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository){}
  // async execute({password, userId}: Request){
  //   const user = await this.usersRepository.findById(userId)

  //   if(!user){
  //     throw new NotFoundException('Não há usuário cadastrado com esse id.');
  //   }

  //   user.recoverToken = randomBytes(32).toString('hex');

  //   await this.usersRepository.update(user)
    
  //   await this.mailerService.sendMail({
  //     to: email,
  //     subject: "Redefinição de senha",
  //     template: '/password-recover',
  //     text: "Este é um teste de envio de email usando Node",
  //     context: {
  //         name: user.name 
  //     }
  // })
    
  // }
}