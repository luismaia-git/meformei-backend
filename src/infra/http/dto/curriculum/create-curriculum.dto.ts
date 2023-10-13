import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCurriculumBody {
  @ApiProperty()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  requiredHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  optionalHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  extraCurricularHours: number;
}
