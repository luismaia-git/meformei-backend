import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudentBody } from './create-student.dto';


export class UpdateStudentBody extends PartialType(
  OmitType(CreateStudentBody, ['password', 'curriculumId']),
) {}