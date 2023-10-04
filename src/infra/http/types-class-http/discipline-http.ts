import { ApiProperty } from '@nestjs/swagger';

export class DisciplineHttp {
  @ApiProperty()
  cod: string;
  @ApiProperty()
  optional: boolean;
  @ApiProperty()
  name: string;
  @ApiProperty()
  courseOutline: string;
  @ApiProperty()
  semester: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  prerequisiteDisciplines: string[];
  @ApiProperty()
  bibliography: string[];
  @ApiProperty()
  curriculumId: string;
  @ApiProperty()
  hours: number;
}
