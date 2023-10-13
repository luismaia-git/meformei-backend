import { Injectable } from '@nestjs/common';

import { ExtraCurricular } from '@application/entities/extracurricular-activities/extracurricular-activities';
import { ExtraCurricularRepository } from '@application/repositories/extracurricular-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { StudentNotFound } from '../errors/student-not-found';

interface Request {
  studentRegistration: string;
}
interface Response {
  extraCurricularActivities: ExtraCurricular[];
}

@Injectable()
export class FindExtraCurricularActivityByStudent {
  constructor(
    private extraCurricularRepository: ExtraCurricularRepository,
    private studentsRepository: StudentsRepository) {}

  async execute(request: Request): Promise<Response> {
    const { studentRegistration } = request;

    const student = await this.studentsRepository.findByRegistration(studentRegistration);

    if (!student) {
      throw new StudentNotFound();
    }
    
    const extraCurricularActivities =
      await this.extraCurricularRepository.findByStudentId(
        student.studentId.toString(),
      );

    return {
      extraCurricularActivities,
    };
  }
}
