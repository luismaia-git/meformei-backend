import { UpdateAdmin } from '@application/use-cases/admin/update-admin';
import { ChangePassword } from '@application/use-cases/authentication/change-password';
import { CheckAdminAccountEmail } from '@application/use-cases/authentication/check-admin-account-email';
import { CheckAdminAccountUsername } from '@application/use-cases/authentication/check-admin-account-username';
import { CheckStudentAccountEmail } from '@application/use-cases/authentication/check-student-account-email';
import { CheckStudentAccountByRegistration } from '@application/use-cases/authentication/check-student-account-registration';
import { CheckStudentAccountUsername } from '@application/use-cases/authentication/check-student-account-username';
import { ForgotPassword } from '@application/use-cases/authentication/forgot-password';
import { Login } from '@application/use-cases/authentication/login';
import { RegisterAccountAdmin } from '@application/use-cases/authentication/register-admin';
import { RegisterAccountStudent } from '@application/use-cases/authentication/register-student';
import { ResetPassword } from '@application/use-cases/authentication/reset-password';
import { ValidToken } from '@application/use-cases/authentication/valid-token';
import { ROLES } from '@config/constants';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as RequestE } from 'express';
import { AuthGuard } from '../auth/auth-guard';
import { GetUser } from '../auth/get-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateAdminBody } from '../dto/admin/update-admin.dto';
import { ChangePasswordDto } from '../dto/auth/change-password.dto';
import { LoginBody } from '../dto/auth/login.dto';
import { RecoverPasswordDto } from '../dto/auth/recoverPassword.dto';
import { RegisterAccountAdminBody } from '../dto/auth/register-account-admin.dto';
import { RegisterAccountStudentBody } from '../dto/auth/register-account-student.dto';
import { ResponseWithMessage } from '../dto/response-message';
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
@UseInterceptors(ClassSerializerInterceptor)
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
    private checkStudentByRegistration: CheckStudentAccountByRegistration,
    private forgotPassword: ForgotPassword,
    private changePassword: ChangePassword,
    private resetPassword: ResetPassword,
    private updateAdmin: UpdateAdmin,
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
      hash,
    } = request;

    if (hash != process.env.HASH_ADMIN) {
      throw new BadRequestException('hash is invalid');
    }
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

  @Get('admin/check/email/:email')
  @ApiResponse({ type: Boolean })
  async checkEmailAdmin(@Param('email') email: string) {
    const adminAlreadyExists = await this.checkAdminAccountEmail.execute({
      email: email,
    });

    if (adminAlreadyExists) {
      throw new ForbiddenException('Email already used');
    }
    return true;
  }


  @Patch('admin/:adminId')
  @ApiResponse({ type: Boolean })
  async updateProfileAdmin(
    @Body() updateAdminBody : UpdateAdminBody,
    @Param('adminId') adminId: string
  ) {
    const { admin }= await this.updateAdmin.execute({id: adminId, admin: updateAdminBody})
    
    return {
      message: 'Dados atualizados com sucesso!',

      admin: AdminViewModel.toHTTP(admin),
    };
  }

  @Get('admin/check/username/:username')
  @ApiResponse({ type: Boolean })
  async checkUsernameAdmin(@Param('username') username: string) {
    const adminAlreadyExists = await this.checkAdminAccountUsername.execute({
      username: username,
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

  @Get('student/check/email/:email')
  @ApiResponse({ type: Boolean })
  async checkEmailStudent(@Param('email') email: string) {
    const studentAlreadyExists = await this.checkStudentAccountEmail.execute({
      email: email,
    });

    if (studentAlreadyExists) {
      throw new ForbiddenException('Email already used');
    }
    return true;
  }

  @Get('student/check/username/:username')
  @ApiResponse({ type: Boolean })
  async checkUsernameStudent(@Param('username') username: string) {
    const studentAlreadyExists = await this.checkStudentAccountUsername.execute(
      {
        username: username,
      },
    );

    if (studentAlreadyExists) {
      throw new ForbiddenException('Username already used');
    }
    return true;
  }

  @Get('student/check/registration/:registration')
  @ApiResponse({ type: Boolean })
  async checkRegistrationStudent(@Param('registration') registration: string) {
    const studentAlreadyExists = await this.checkStudentByRegistration.execute({
      registration: registration,
    });

    if (studentAlreadyExists) {
      throw new ForbiddenException('Registration already used');
    }
    return true;
  }

  @Get('session')
  @ApiResponse({ type: Boolean })
  async session(@Request() req: RequestE) {
    const isValid = await this.validToken.execute(req);

    return isValid;
  }

  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  async getMe(@GetUser() user: any) {
    return user;
  }

  @ApiOkResponse({
    description: 'Enviar email de recuperação de senha',
    type: ResponseWithMessage,
  })
  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<ResponseWithMessage> {
  
    await this.forgotPassword.execute(recoverPasswordDto);

    return {
      message: 'Foi enviado um email para você com instruções para resetar sua senha',
    };
  }

  @ApiOkResponse({
    description: 'Alterar a senha',
    type: ResponseWithMessage,
  })
  @Patch(':id/change-password')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  async changeUserPassword(
    @Param('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: any,
  ): Promise<ResponseWithMessage> {
    if (user.id !== userId)
      throw new UnauthorizedException(
        'Você não tem permissão para realizar esta operação',
      );

    await this.changePassword.execute({
      userId,
      newPassword: changePasswordDto.password,
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  @ApiOkResponse({
    description: 'Alterar a senha',
    type: ResponseWithMessage,
  })
  @Post('reset-password/:token')
  async resetUserPassword(
    @Param('token') token: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseWithMessage> {
   

    await this.resetPassword.execute({
      recoverToken: token,
      ...changePasswordDto
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
