import { Injectable } from '@nestjs/common';

import {
  CourseHistory,
  StatusType,
} from '@application/entities/course-history/course-history';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { StudentNotFound } from '../errors/student-not-found';

interface FindCourseHistoryRequest {
  status: StatusType;
  studentId: string;
}
interface FindCourseHistoryResponse {
  courseHistory: CourseHistory[];
}

@Injectable()
export class FindCourseHistoryByStatusAndStudentId {
  constructor(
    private courseHistoriesRepository: CourseHistoriesRepository,
    private studentsRepository: StudentsRepository
    ) {}

  async execute(
    request: FindCourseHistoryRequest,
  ): Promise<FindCourseHistoryResponse> {
    const { status, studentId } = request;
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFound();
    }
    const courseHistory =
      await this.courseHistoriesRepository.findByStatusAndStudent({
        studentId: student.studentId.toString(),
        status,
      });

    return {
      courseHistory,
    };
  }
}
