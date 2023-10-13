import { Injectable } from '@nestjs/common';

import {
  ExtraCurricular
} from '@application/entities/extracurricular-activities/extracurricular-activities';
import { ExtraCurricularRepository } from '@application/repositories/extracurricular-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { SituationType } from '@prisma/client';
import { StudentNotFound } from '../errors/student-not-found';

interface CreateExtraCurricularActivityResponse {
  extraCurricularActivity: ExtraCurricular;
}


export interface RequestCreateExtraCurricularActivity {
  studentId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  hours: number;
  situation: SituationType;
  activityType: string;
  participationType?: string;
  atUfc: boolean;
  institutionName: string;
  institutionCountry?: string;
  institutionCnpj?: string;
}

@Injectable()
export class CreateExtraCurricularActivity {
  constructor(
    private extraCurricularRepository: ExtraCurricularRepository,
    private studentsRepository: StudentsRepository
    ) {}

  async execute(
    request: RequestCreateExtraCurricularActivity,
  ): Promise<CreateExtraCurricularActivityResponse> {

    const student = await this.studentsRepository.findById(request.studentId);

    if (!student) {
      throw new StudentNotFound();
    }
    
    const extraCurricular = ExtraCurricular.create({
      ...request, studentId: student.studentId.toString()
    });

    await this.extraCurricularRepository.create(extraCurricular);

    return {
      extraCurricularActivity: extraCurricular,
    };
  }
}
