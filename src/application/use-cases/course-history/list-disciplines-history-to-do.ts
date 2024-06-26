import { Injectable } from '@nestjs/common';

import { CourseHistory } from '@application/entities/course-history/course-history';
import { Discipline } from '@application/entities/discipline/discipline';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { DisciplinesRepository } from '@application/repositories/disciplines-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { StudentNotFound } from '../errors/student-not-found';

interface ListCourseHistoriesResponse {
  disciplinesTodo: Discipline[];
}

interface Request {
  curriculumId: string;
  studentId: string;
}

@Injectable()
export class ListDisciplinesHistoryTodo {
  constructor(
    private courseHistoriesRepository: CourseHistoriesRepository,
    private disciplinesRepository: DisciplinesRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute(req: Request): Promise<ListCourseHistoriesResponse> {
    const { curriculumId, studentId } = req;

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFound();
    }

    const disciplinesByCurriculum =
      await this.disciplinesRepository.findByCurriculum(curriculumId);

    const disciplinesObrigatorias = disciplinesByCurriculum.filter(
      (discipline: Discipline) => discipline.optional === false,
    );

    const courseHistories = await this.courseHistoriesRepository.findByStudent(
      student.studentId.toString(),
    );

    const disciplinesDone = courseHistories.map(
      (courseHistory: CourseHistory) => courseHistory.discipline,
    );

    const disciplinesTodo = disciplinesObrigatorias.filter(
      (discipline) => !disciplinesDone.includes(discipline),
    );

    return {
      disciplinesTodo,
    };
  }
}
