import { StatusType } from '@application/entities/course-history/course-history';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum Semester {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7,
  EIGHTH = 8,
  NINTH = 9,
  TENTH = 10,
  ELEVENTH = 11,
  TWELFTH = 12,
}

export enum StatusCourseHistory {
  DONE = 'DONE',
  INPROGRESS = 'INPROGRESS',
  FAILED = 'FAILED',
  WITHDRAWAL = 'WITHDRAWAL',
}

export class UpdateDisciplineInStudentSemester {
  
  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusCourseHistory)
  status: StatusType;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Semester)
  semester: number;

  @ApiProperty({example: "12:00"})
  @IsOptional()
  @Transform((value) => {
    const timeString = `${new Date().toLocaleDateString()} ${value}:00`;
    return new Date(timeString);
  })
  startTime: Date;

  @ApiProperty({example: "14:00"})
  @IsOptional()
  @Transform((value) => {
    const timeString = `${new Date().toLocaleDateString()} ${value}:00`;
    return new Date(timeString);
  })
  endTime: Date;

  @ApiProperty()
  @IsOptional()
  hours: number;

  @ApiProperty()
  @IsOptional()
  daysWeek: string[];
}


