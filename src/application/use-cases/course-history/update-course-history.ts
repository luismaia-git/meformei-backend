import { Injectable } from '@nestjs/common';

import { CourseHistory } from '@application/entities/course-history/course-history';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { UpdateDisciplineInStudentSemester } from '@infra/http/dto/course-history/update-discipline-in-student-semester.dto';
import { CourseHistoryNotFound } from '../errors/course-history-not-found';

interface UpdateCourseHistoryRequest {
  id: string;
  courseHistory: UpdateDisciplineInStudentSemester;
}
interface UpdateCourseHistoryResponse {
  courseHistory: CourseHistory;
}

@Injectable()
export class UpdateCourseHistory {
  constructor(private courseHistoriesRepository: CourseHistoriesRepository) {}

  async execute(
    request: UpdateCourseHistoryRequest,
  ): Promise<UpdateCourseHistoryResponse> {
    const { courseHistory: body, id } = request;

    const courseHistory = await this.courseHistoriesRepository.findById(
      id,
    );

    if (!courseHistory) throw new CourseHistoryNotFound();

    courseHistory.update(body)
    await this.courseHistoriesRepository.save(
      courseHistory,
    );

    return {
      courseHistory,
    };
  }
}
