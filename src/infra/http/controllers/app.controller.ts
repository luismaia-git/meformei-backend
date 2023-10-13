import { ROLES } from '@config/constants';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
@ApiTags('App root')
@Roles(ROLES.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class AppController {
  @Get()
  async root(): Promise<void> {
    return null;
    // await this.sendGrid.send({
    //   to: "luismaia1407@gmail.com",
    //   from: {name: "Meformei", email: process.env.FROM_EMAIL},
    //   subject: "Envio de email teste",
    //   text: "Este é um teste de envio de email usando Node",
    //   html: "<strong>Este é um teste de envio de email usando Node</strong>",
    // });
  }
}
