import { Admin } from '@application/entities/admin/admin';
import { User } from '@application/entities/user/user';
import { AdminsRepository } from '@application/repositories/admins-repository';
import { UsersRepository } from '@application/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExists } from '../errors/user-already-exists';
import { EncriptionPassword } from './encription-password';
interface RequestBody {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  city: string;
  state: string;
}

@Injectable()
export class RegisterAccountAdmin {
  constructor(
    private adminsRepository: AdminsRepository,
    private usersRepository: UsersRepository,
    private encriptionPassword: EncriptionPassword,
  ) {}

  async execute(request: RequestBody) {
    const { lastname, username, email, name, password, city, state } = request;

    const UserAlreadyExist = await this.usersRepository.findByUsername(username)

    
    if (UserAlreadyExist) {
      throw new UserAlreadyExists();
    }

    const user = User.create({
      name,
      email,
      password,
      city,
      lastname,
      username,
      state: state,
      inative: null,
      avatar: null,
    });

    const admin = Admin.create(
      {
        name,
        email,
        password,
        city,
        lastname,
        state: state,
        username,
        avatar: null,
        inative: null,
      },
      user.id,
    );

    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(
      user.password,
      user.salt,
    );

    user.recoverToken = null;

    await this.adminsRepository.create(admin);

    return {
      admin,
      user,
    };
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
