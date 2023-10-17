import { CourseHistory } from "@application/entities/course-history/course-history";
import { CourseHistoriesRepository, FindByStatusAndStudent, FindByStudentAndSemester, FindByStudentAndSemesterAndDiscipline } from "@application/repositories/course-histories-repository";



export class InMemoryCourseHistoryRepository implements CourseHistoriesRepository {
  public courseHistory: CourseHistory[] = [];
  
  async findByStudentAndSemester(req: FindByStudentAndSemester): Promise<CourseHistory[] | []> {
    const courseHistorySearched = this.courseHistory.filter(
      (item) => 
      item.studentId.toString() === req.studentId ||
      item.semester === req.semester
    );

    return courseHistorySearched;
  }
  
  async findByStudentAndSemesterAndDiscipline(req: FindByStudentAndSemesterAndDiscipline): Promise<CourseHistory> {
    const courseHistorySearched = this.courseHistory.find(
      (item) => 
      item.studentId.toString() === req.studentId &&
      item.semester === req.semester &&
      item.discipline.id.toString() === req.disciplineId,
    );

    return courseHistorySearched;
  }
  
  async findByStatusAndStudent(req: FindByStatusAndStudent): Promise<CourseHistory[] | []> {
    const courseHistorySearched = this.courseHistory.filter(
      (item) => item.studentId.toString() === req.studentId || item.status === req.status,
    );

    return courseHistorySearched;
  }
  
  async findByStudent(studentId: string): Promise<CourseHistory[] | []> {
    const courseHistorySearched = this.courseHistory.filter(
      (item) => item.studentId.toString() === studentId,
    );

    return courseHistorySearched;
  }
  


  async findById(courseId: string): Promise<CourseHistory | null> {
    const courseHistory = this.courseHistory.find((item) => item.id.toString() === courseId);

    if (!courseHistory) {
      return null;
    }

    return courseHistory;
  }

  async create(courseHistory: CourseHistory) {
    this.courseHistory.push(courseHistory);
  }

  async save(courseHistory: CourseHistory): Promise<CourseHistory> {
    const index = this.courseHistory.findIndex((item) => item.id === courseHistory.id);

    if (index >= 0) {
      this.courseHistory[index] = courseHistory;
    }
    return this.courseHistory[index];
  }

  async list(): Promise<CourseHistory[] | []> {
    return this.courseHistory;
  }

  async delete(courseId: string): Promise<void> {
    const coursesIndex = this.courseHistory.findIndex(
      (item) => item.id.toString() === courseId,
    );

    if (coursesIndex >= 0) {
      this.courseHistory.splice(coursesIndex, 1);
    }
  }
}
