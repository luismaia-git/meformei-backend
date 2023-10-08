import {
  CourseHistory,
  CourseHistoryProps,
} from '@application/entities/course-history/course-history';
import { Override, makeDiscipline } from './discipline-factory';

type OverrideCourseHistory = Partial<CourseHistoryProps>;

export function makeCourseHistory(
  override: OverrideCourseHistory = {},
  overrideDiscipline: Override = {},
) {
  return CourseHistory.create({
    studentRegistration: 'studentRegistration',
    createdAt: new Date(),
    daysWeek: ['SEG, QUA, QUI'],
    discipline: makeDiscipline(overrideDiscipline),
    endTime: new Date(),
    hours: 64,
    semester: 1,
    startTime: new Date(),
    status: 'INPROGRESS',
    ...override,
  });
}
