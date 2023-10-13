import { Injectable } from '@nestjs/common';

import { CourseHistory } from '@application/entities/course-history/course-history';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { StudentNotFound } from '../errors/student-not-found';

interface FindCourseHistoryRequest {
  studentId: string;
}
interface FindCourseHistoryResponse {
  courseHistories: CourseHistory[];
}

@Injectable()
export class FindDisciplinesHistoryByStudentId {
  constructor(
    private courseHistoriesRepository: CourseHistoriesRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute(
    request: FindCourseHistoryRequest,
  ): Promise<FindCourseHistoryResponse> {
    const { studentId } = request;

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFound();
    }
    const courseHistories = await this.courseHistoriesRepository.findByStudent(
      student.studentId.toString(),
    );

    return {
      courseHistories,
    };
  }
}
