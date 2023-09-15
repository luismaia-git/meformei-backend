import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmailAdminBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Precisa ser um email' })
  email: string;
}
