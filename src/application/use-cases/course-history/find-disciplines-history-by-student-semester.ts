import { Injectable } from '@nestjs/common';

import { CourseHistory } from '@application/entities/course-history/course-history';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { StudentNotFound } from '../errors/student-not-found';

interface FindCourseHistoryRequest {
  semester: number;
  studentId: string;
}
interface FindCourseHistoryResponse {
  courseHistories: CourseHistory[];
}

@Injectable()
export class FindDisciplinesHistoryByStudentIdBySemester {
  constructor(
    private courseHistoriesRepository: CourseHistoriesRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute(
    request: FindCourseHistoryRequest,
  ): Promise<FindCourseHistoryResponse> {
    const { semester, studentId } = request;
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFound();
    }
    const courseHistories =
      await this.courseHistoriesRepository.findByStudentAndSemester({
        semester,
        studentId: student.studentId.toString(),
      });

    return {
      courseHistories,
    };
  }
}
