import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmailStudentBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Precisa ser um email' })
  email: string;
}
