import { Admin } from '@application/entities/admin/admin';
import { User } from '@application/entities/user/user';
import { AdminsRepository } from '@application/repositories/admins-repository';
import { UsersRepository } from '@application/repositories/users-repository';
import { Injectable } from '@nestjs/common';
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

    const adminAlreadyExists = await this.adminsRepository.findByUsername(
      username,
    );

    if (adminAlreadyExists) {
      throw new UserAlreadyExists();
    }

    const hashedPassword = await this.encriptionPassword.execute({ password });

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      city,
      lastname,
      username,
      state: state,
    });

    const admin = Admin.create(
      {
        name,
        email,
        password: hashedPassword,
        city,
        lastname,
        state: state,
        username,
      },
      user.id,
    );

    await this.usersRepository.create(user);
    await this.adminsRepository.create(admin);

    return {
      admin,
      user,
    };
  }
}
