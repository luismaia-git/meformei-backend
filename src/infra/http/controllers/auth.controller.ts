import { CheckAdminAccountEmail } from '@application/use-cases/authentication/check-admin-account-email';
import { CheckAdminAccountUsername } from '@application/use-cases/authentication/check-admin-account-username';
import { CheckStudentAccountEmail } from '@application/use-cases/authentication/check-student-account-email';
import { CheckStudentAccountUsername } from '@application/use-cases/authentication/check-student-account-username';
import { Login } from '@application/use-cases/authentication/login';
import { RegisterAccountAdmin } from '@application/use-cases/authentication/register-admin';
import { RegisterAccountStudent } from '@application/use-cases/authentication/register-student';
import { ValidToken } from '@application/use-cases/authentication/valid-token';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as RequestE } from 'express';
import { CheckEmailAdminBody } from '../dto/auth/check-email-admin.dto';
import { CheckEmailStudentBody } from '../dto/auth/check-email-student.dto';
import { CheckUsernameAdminBody } from '../dto/auth/check-username-admin.dto';
import { CheckUsernameStudentBody } from '../dto/auth/check-username-student.dto';
import { LoginBody } from '../dto/auth/login.dto';
import { RegisterAccountAdminBody } from '../dto/auth/register-account-admin.dto';
import { RegisterAccountStudentBody } from '../dto/auth/register-account-student.dto';
import { AdminHttp } from '../types-class-http/admin-http';
import { StudentHttp } from '../types-class-http/student-http';
import { AdminViewModel } from '../view-models/admin-view-model';
import { StudentViewModel } from '../view-models/student-view-model';

export class ResponseLoginStudent {
  @ApiProperty()
  message: string;
  @ApiProperty()
  user: StudentHttp;

  @ApiProperty()
  token: string;

  @ApiProperty()
  isAdmin: boolean;
}

export class ResponseLoginAdmin {
  @ApiProperty()
  message: string;
  @ApiProperty()
  user: AdminHttp;

  @ApiProperty()
  token: string;

  @ApiProperty()
  isAdmin: boolean;
}

@Controller('auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(
    private login: Login,
    private registerAdmin: RegisterAccountAdmin,
    private registerStudent: RegisterAccountStudent,
    private validToken: ValidToken,
    private checkAdminAccountEmail: CheckAdminAccountEmail,
    private checkAdminAccountUsername: CheckAdminAccountUsername,
    private checkStudentAccountEmail: CheckStudentAccountEmail,
    private checkStudentAccountUsername: CheckStudentAccountUsername,
  ) {}

  @Post('signin')
  @ApiResponse({ type: ResponseLoginStudent || ResponseLoginAdmin })
  async sigin(
    @Body() request: LoginBody,
  ): Promise<ResponseLoginStudent | ResponseLoginAdmin> {
    const { username, password } = request;
    const { token, admin, student } = await this.login.execute({
      username,
      password,
    });

    if (student) {
      return {
        message: 'Logado com sucesso',
        user: StudentViewModel.toHTTP(student),
        token,
        isAdmin: false,
      };
    }

    return {
      message: 'Logado com sucesso',
      user: AdminViewModel.toHTTP(admin),
      token,
      isAdmin: true,
    };
  }

  @Post('admin/signup')
  // @UseGuards(AuthGuard)
  @ApiResponse({ type: 'messagem' })
  async signupAdmin(@Body() request: RegisterAccountAdminBody) {
    const {
      username,
      password,
      city,
      state,
      email,
      lastname,
      name,
      passwordConfirmation,
    } = request;

    if (passwordConfirmation != password) {
      throw new BadRequestException('password confirmation error');
    }
    await this.registerAdmin.execute({
      username,
      password,
      city,
      state,
      email,
      lastname,
      name,
    });

    return {
      message: 'Registrado com sucesso',
    };
  }

  @Get('admin/check/email')
  @ApiResponse({ type: Boolean })
  async checkEmailAdmin(@Request() req: CheckEmailAdminBody) {
    const adminAlreadyExists = this.checkAdminAccountEmail.execute({
      email: req.email,
    });

    if (adminAlreadyExists) {
      throw new ForbiddenException('Email already used');
    }
    return true;
  }

  @Get('admin/check/username')
  @ApiResponse({ type: Boolean })
  async checkUsernameAdmin(@Request() req: CheckUsernameAdminBody) {
    const adminAlreadyExists = this.checkAdminAccountUsername.execute({
      username: req.username,
    });

    if (adminAlreadyExists) {
      throw new ForbiddenException('Username already used');
    }
    return true;
  }

  @Post('student/signup')
  @ApiResponse({ type: 'messagem' })
  async signupStudent(@Body() request: RegisterAccountStudentBody) {
    const {
      username,
      password,
      city,
      state,
      email,
      lastname,
      name,
      curriculumId,
      enrollmentSemester,
      enrollmentYear,
      registration,
      passwordConfirmation,
    } = request;

    if (passwordConfirmation != password) {
      throw new BadRequestException('password confirmation error');
    }

    await this.registerStudent.execute({
      username,
      password,
      city,
      state,
      email,
      lastname,
      name,
      curriculumId,
      enrollmentSemester,
      enrollmentYear,
      registration,
    });

    return {
      message: 'Registrado com sucesso',
    };
  }

  @Get('student/check/email')
  @ApiResponse({ type: Boolean })
  async checkEmailStudent(@Request() req: CheckEmailStudentBody) {
    const studentAlreadyExists = this.checkStudentAccountEmail.execute({
      email: req.email,
    });

    if (studentAlreadyExists) {
      throw new ForbiddenException('Email already used');
    }
    return true;
  }

  @Get('student/check/username')
  @ApiResponse({ type: Boolean })
  async checkUsernameStudent(@Request() req: CheckUsernameStudentBody) {
    const studentAlreadyExists = this.checkStudentAccountUsername.execute({
      username: req.username,
    });

    if (studentAlreadyExists) {
      throw new ForbiddenException('Username already used');
    }
    return true;
  }

  @Get('session')
  @ApiResponse({ type: Boolean })
  async session(@Request() req: RequestE) {
    const isValid = await this.validToken.execute(req);

    return isValid;
  }
}
