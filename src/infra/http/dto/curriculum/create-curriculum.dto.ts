import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCurriculumBody {
  @ApiProperty()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  requiredHours: number;

  @ApiProperty()
  @IsNotEmpty()
  optionalHours: number;

  @ApiProperty()
  @IsNotEmpty()
  extraCurricularHours: number;
}
