import { Injectable } from '@nestjs/common';

import { Student } from '@application/entities/student/student';
import { CourseHistoriesRepository } from '@application/repositories/course-histories-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { EntityInUse } from '../errors/entity-in-use';
import { StudentNotFound } from '../errors/student-not-found';

interface DeleteStudentResponse {
  student: Student;
}
interface DeleteStudentRequest {
  studentId: string;
}

@Injectable()
export class DeleteStudent {
  constructor(private studentsRepository: StudentsRepository,
    private courseHistoryRepository: CourseHistoriesRepository) {}

  async execute(request: DeleteStudentRequest): Promise<DeleteStudentResponse> {
    const student = await this.studentsRepository.findById(request.studentId);

    if (!student) {
      throw new StudentNotFound();
    }

    const isExistingCourseHistoryWithStudent = await this.courseHistoryRepository.findByStudent(student.studentId.toString())
    if(isExistingCourseHistoryWithStudent.length > 0){
      throw new EntityInUse('student')
    }

    await this.studentsRepository.delete(student.studentId.toString());

    return {
      student,
    };
  }
}
