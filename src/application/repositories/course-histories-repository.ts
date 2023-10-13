import {
  CourseHistory,
  StatusType,
} from '@application/entities/course-history/course-history';
export abstract class CourseHistoriesRepository {
  abstract create(courseHistory: CourseHistory): Promise<void>;
  abstract findById(courseHistoryId: string): Promise<CourseHistory | null>;
  abstract findByStudentAndSemester(
    req: FindByStudentAndSemester,
  ): Promise<CourseHistory[] | []>;
  abstract findByStudentAndSemesterAndDiscipline(
    req: FindByStudentAndSemesterAndDiscipline,
  ): Promise<CourseHistory | null>;
  abstract findByStatusAndStudent(
    req: FindByStatusAndStudent,
  ): Promise<CourseHistory[] | []>;
  abstract findByStudent(
    studentId: string,
  ): Promise<CourseHistory[] | []>;
  abstract save(courseHistory: CourseHistory): Promise<CourseHistory>;
  abstract delete(courseHistoryId: string): Promise<void>;
  abstract list(): Promise<CourseHistory[] | []>;
}

export type FindByStudentAndSemesterAndDiscipline = {
  studentId: string;
  semester: number;
  disciplineId: string;
};

export type FindByStudentAndSemester = {
  studentId: string;
  semester: number;
};

export type FindByStatusAndStudent = {
  studentId: string;
  status: StatusType;
};
