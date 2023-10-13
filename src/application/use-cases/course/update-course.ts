import { Injectable } from '@nestjs/common';

import { Course } from '@application/entities/curriculum/course';
import { CoursesRepository } from '@application/repositories/courses-repository';
import { UpdateCourseBody } from '@infra/http/dto/course/update-course.dto';
import { CourseNotFound } from '../errors/course-not-found';

type UpdateCourseRequest = {
  id: string;
  course: UpdateCourseBody;
};
interface UpdateCourseResponse {
  course: Course;
}

@Injectable()
export class UpdateCourse {
  constructor(private coursesRepository: CoursesRepository) {}

  async execute(request: UpdateCourseRequest): Promise<UpdateCourseResponse> {
    const { course: body, id } = request;

    const course = await this.coursesRepository.findById(id);

    if (!course) throw new CourseNotFound();

    course.update(body);

    await this.coursesRepository.save(course);

    return {
      course,
    };
  }
}
