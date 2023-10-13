import { UsersRepository } from '@application/repositories/users-repository';
import {
  ConflictException,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ChangePassword } from './change-password';
interface Request {
  recoverToken: string;
  password: string;
  passwordConfirmation: string;
}
export class ResetPassword {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly changePassword: ChangePassword,
  ) {}

  async execute({ password, passwordConfirmation, recoverToken }: Request) {
    if (password != passwordConfirmation)
      throw new UnprocessableEntityException('As senhas não conferem');

    const user = await this.usersRepository.findByRecoverToken(recoverToken);

    if (!user) throw new NotAcceptableException('Token inválido.');

    try {
      await this.changePassword.execute({
        userId: user.id.toString(),
        newPassword: password,
      });
    } catch (error) {
      throw new ConflictException('Nao foi possivel alterar a senha');
    }
  }
}
