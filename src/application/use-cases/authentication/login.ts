import { AdminsRepository } from '@application/repositories/admins-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { UsersRepository } from '@application/repositories/users-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ROLES, jwtOptions } from '@config/constants';
import { StudentViewModel } from '@infra/http/view-models/student-view-model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserNotFound } from '../errors/user-not-found';
import { AdminViewModel } from './../../../infra/http/view-models/admin-view-model';
interface LoginRequest {
  username: string;
  password: string;
}

@Injectable()
export class Login {
  constructor(
    private usersRepository: UsersRepository,
    private adminsRepository: AdminsRepository,
    private studentsRepository: StudentsRepository,
    private jwtService: JwtService,
  ) {}

  async execute(request: LoginRequest) {
    const { username, password } = request;
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFound();
    }
    const student = await this.studentsRepository.findByUserId(
      user.id.toString(),
    );

    if (student) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new BadRequestException('Password does not match.');
      }

      delete student.password;

      const jwtPayload = {
        ...StudentViewModel.toHTTP(student),
        loginAt: new Date(),
        roles: [ROLES.STUDENT],
      };

      const token = this.jwtService.sign(jwtPayload, jwtOptions);

      return {
        token,
        student,
      };
    }

    const admin = await this.adminsRepository.findByUserId(user.id.toString());

    if (admin) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new BadRequestException('Password does not match.');
      }

      delete admin.password;

      const jwtPayload = {
        ...AdminViewModel.toHTTP(admin),
        loginAt: new Date(),
        roles: [ROLES.ADMIN],
      };

      const token = this.jwtService.sign(jwtPayload, jwtOptions);

      return {
        token,
        admin,
      };
    }
  }
}
