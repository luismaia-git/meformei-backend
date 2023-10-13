import { CourseHistory, StatusTypeClass } from '@application/entities/course-history/course-history';
import { ApiProperty } from '@nestjs/swagger';
import { DisciplineViewModel } from './discipline-view-model';

export class CourseHistoryViewModel {
  @ApiProperty()
  static toHTTP(courseHistory: CourseHistory) {
    const {
      id,
      createdAt,
      daysWeek,
      discipline,
      endTime,
      hours,
      semester,
      startTime,
      status,
      studentId,
    } = courseHistory;

    return {
      id: id.toValue(),
      createdAt,
      daysWeek,
      discipline: DisciplineViewModel.toHTTP(discipline),
      endTime,
      hours,
      semester,
      startTime,
      status,
      studentId,
    };
  }

  @ApiProperty()
  static toFront(courseHistories: CourseHistory[]) {
    const periods = findFirstOccurrences(courseHistories);

    const output: ToFront[] = [];

    periods.forEach((period: number) => {
      let disciplines: DisciplineToFront[] = [];
      const obj: ToFront = {
        period: null,
        disciplines: null,
      };

      const courseHistoriesByPeriod = courseHistories.filter(
        (ch) => ch.semester === period,
      );
      obj['period'] = period;
      const disciplinesByPeriod: DisciplineToFront[] =
        courseHistoriesByPeriod.map((ch) => {
          const disc = DisciplineViewModel.toHTTP(ch.discipline);
          delete disc.semester;
          const discipline: DisciplineToFront = {
            ...disc,
            courseHistoryId: ch.id.toString(),
            workload: ch.hours,
            start: ch.startTime,
            end: ch.endTime,
            daysWeek: ch.daysWeek,
            bibliography: ch.discipline.bibliography,
            status: ch.status,
          };

          return discipline;
        });
      disciplines = disciplinesByPeriod;
      obj['disciplines'] = disciplines;
      output.push(obj);
    });

    return output;
  }
}

export function findFirstOccurrences(objects: CourseHistory[]): number[] {
  const uniqueValues: number[] = [];
  const firstOccurrences: number[] = [];

  for (const obj of objects) {
    if (!uniqueValues.includes(obj.semester)) {
      uniqueValues.push(obj.semester);
      firstOccurrences.push(obj.semester);
    }
  }

  return firstOccurrences;
}

type StatusType = 'DONE' | 'INPROGRESS' | 'FAILED' | 'WITHDRAWAL';

export abstract class DisciplineToFront {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String })
  courseHistoryId: string

  @ApiProperty()
  name: string;
  @ApiProperty()
  cod: string;
  @ApiProperty()
  menu: string;
  @ApiProperty()
  curriculumId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isOptional: boolean;
  @ApiProperty({ example: ['CK0101', 'CK0110'], type: String, isArray: true })
  prerequisites: string[];
  @ApiProperty()
  workload: number;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  @ApiProperty({ type: String, isArray: true })
  daysWeek: string[];

  @ApiProperty({ type: String, isArray: true })
  bibliography: string[];

  @ApiProperty({type: StatusTypeClass})
  status: StatusType;

 
}

export abstract class ToFront {
  @ApiProperty()
  period: number;

  @ApiProperty({ isArray: true, type: DisciplineToFront })
  disciplines: DisciplineToFront[];
}
