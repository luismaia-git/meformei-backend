import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckUsernameStudentBody {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
