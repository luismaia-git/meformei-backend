import { Student } from '@application/entities/student/student';
import { ApiProperty } from '@nestjs/swagger';
import { UniversityViewModel } from './university-view-model';

export class StudentViewModel {
  @ApiProperty()
  static toHTTP(student: Student) {
    const {
      curriculumId,
      email,
      id,
      name,
      registration,
      city,
      state,
      courseName,
      currentSemester,
      enrollmentSemester,
      enrollmentYear,
      lastname,
      studentId,
      university,
      username,
      inative,
      avatar,
      createdAt,
    } = student;

    return {
      id: id.toValue(),
      studentId: studentId.toValue(),
      name,
      lastname,
      username,
      email,
      registration,
      inative,
      avatar,
      curriculumId,
      city,
      state,
      currentSemester,
      enrollmentSemester,
      enrollmentYear,
      courseName,
      university: UniversityViewModel.toHTTP(university),
      createdAt,
    };
  }
}
