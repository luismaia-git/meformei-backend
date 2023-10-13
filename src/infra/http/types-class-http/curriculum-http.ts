import { ApiProperty } from '@nestjs/swagger';
import { UniversityHttp } from './university-http';

export class CurriculumHttp {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  extraCurricularHours: number;

  @ApiProperty()
  optionalHours: number;
  @ApiProperty()
  requiredHours: number;

  @ApiProperty()
  university: UniversityHttp;
}
