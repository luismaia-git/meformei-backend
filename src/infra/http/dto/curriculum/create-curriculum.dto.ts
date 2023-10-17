import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

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
  @Min(0)
  @Max(10000)
  requiredHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(3000)
  optionalHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(3000)
  extraCurricularHours: number;
}
