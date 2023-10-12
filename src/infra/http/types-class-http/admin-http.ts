import { ApiProperty } from '@nestjs/swagger';

export class AdminHttp {
  @ApiProperty()
  id: string;

  @ApiProperty()
  adminId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  inative: Date | null;

  @ApiProperty()
  avatar: string | null;
}
