import { ApiProperty } from '@nestjs/swagger';
import { SituationType } from '@prisma/client';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateExtraCurricularActivityBody {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Min(0)
  @Max(10000)
  hours: number;

  @ApiProperty()
  @IsNotEmpty()
  situation: SituationType;

  @ApiProperty()
  @IsNotEmpty()
  activityType: string;

  @ApiProperty()
  @IsNotEmpty()
  participationType?: string;

  @ApiProperty()
  @IsNotEmpty()
  atUfc: boolean;

  @ApiProperty()
  @IsNotEmpty()
  institutionName: string;

  @ApiProperty()
  @IsNotEmpty()
  institutionCountry?: string;

  @ApiProperty()
  @IsNotEmpty()
  institutionCnpj?: string;
}
