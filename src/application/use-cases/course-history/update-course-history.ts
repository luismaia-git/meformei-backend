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
    const { courseHistory, id } = request;

    const courseHistoryFinded = await this.courseHistoriesRepository.findById(
      id,
    );

    if (!courseHistoryFinded) throw new CourseHistoryNotFound();

    const data = CourseHistory.create(
      { ...courseHistoryFinded._props, ...courseHistory },
      courseHistoryFinded.id,
    );

    const courseHistoryUpdated = await this.courseHistoriesRepository.update(
      data,
    );

    return {
      courseHistory: courseHistoryUpdated,
    };
  }
}
