import { CourseHistory } from '@application/entities/course-history/course-history';
import { Discipline } from '@application/entities/discipline/discipline';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import {
  Discipline as DisciplinePrisma,
  CourseHistory as RawCourseHistoryPrisma,
} from '@prisma/client';
export class PrismaCourseHistoryMapper {
  static toPrisma(courseHistory: CourseHistory): RawCourseHistoryPrisma {
    return {
      id: courseHistory.id.toValue(),
      studentId: courseHistory.studentId,
      disciplineId: courseHistory.discipline.id.toValue(),
      status: courseHistory.status,
      createdAt: courseHistory.createdAt,
      semester: courseHistory.semester,
      startTime: courseHistory.startTime,
      endTime: courseHistory.endTime,
      hours: courseHistory.hours,
      daysWeek: courseHistory.daysWeek,
    };
  }

  static toDomain(raw: RawCourseHistory): CourseHistory {
    return CourseHistory.create(
      {
        studentId: raw.studentId,
        discipline: Discipline.create(
          {
            cod: raw.discipline.cod,
            optional: raw.discipline.optional,
            name: raw.discipline.name,
            courseOutline: raw.discipline.courseOutline,
            semester: raw.discipline.semester,
            description: raw.discipline.description,
            prerequisiteDisciplines:
              raw.discipline.prerequisitesDisciplines.map(
                (discipline) => discipline.cod,
              ),
            curriculumId: raw.discipline.curriculumId,
            bibliography: raw.discipline.bibliography,
            hours: raw.hours,
          },
          new UniqueEntityID(raw.discipline.id),
        ),
        status: raw.status,
        createdAt: raw.createdAt,
        semester: raw.semester,
        startTime: raw.startTime,
        endTime: raw.endTime,
        hours: raw.hours,
        daysWeek: raw.daysWeek,
      },
      new UniqueEntityID(raw.id),
    );
  }
}

type RawCourseHistory = RawCourseHistoryPrisma & {
  discipline: DisciplinePrisma & {
    prerequisitesDisciplines: DisciplinePrisma[];
  };
};
