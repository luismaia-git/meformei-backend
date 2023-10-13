import { Injectable } from '@nestjs/common';

import { CourseHistory } from '@application/entities/course-history/course-history';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { CourseHistoryNotFound } from '../errors/course-history-not-found';
import { StudentNotFound } from '../errors/student-not-found';

interface FindCourseHistoryRequest {
  disciplineId: string;
  semester: number;
  studentRegistration: string;
}
interface FindCourseHistoryResponse {
  courseHistory: CourseHistory;
}

@Injectable()
export class FindCourseHistoryByStudentRegistrationBySemesterByDisciplineId {
  constructor(
    private courseHistoriesRepository: CourseHistoriesRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute(
    request: FindCourseHistoryRequest,
  ): Promise<FindCourseHistoryResponse> {
    const { disciplineId, semester, studentRegistration } = request;
    const student = await this.studentsRepository.findByRegistration(
      studentRegistration,
    );

    if (!student) {
      throw new StudentNotFound();
    }
    const courseHistory =
      await this.courseHistoriesRepository.findByStudentAndSemesterAndDiscipline(
        {
          disciplineId,
          semester,
          studentId: student.studentId.toString(),
        },
      );

    if (!courseHistory) throw new CourseHistoryNotFound();

    return {
      courseHistory,
    };
  }
}
