import { University } from '@application/entities/curriculum/university';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import {
  Curriculum as CurriculumPrisma,
  Student as RawStudentPrisma,
  University as UniversityPrisma,
  User,
} from '@prisma/client';
import { Student } from 'src/application/entities/student/student';

export class PrismaStudentMapper {
  static toPrisma(student: Student) {
    return {
      student: {
        id: student.studentId.toString(),
        userId: student.id.toString(),
        registration: student.registration,
        curriculumId: student.curriculumId,
        enrollmentYear: student.enrollmentYear,
        enrollmentSemester: student.enrollmentSemester,
        currentSemester: student.currentSemester,
      },
      user:{
        id: student.id.toString(),
        email: student.email,
        name: student.name,
        username: student.username,
        lastname: student.lastname,
        password: student.password,
        city: student.city,
        state: student.state,
        avatar: student.avatar,
        inative: student.inative,
        recoverToken: student.recoverToken,
        salt: student.salt
      }
    };
  }

  static toDomain(raw: RawStudent): Student {
    return Student.create(
      {
        email: raw.user.email,
        name: raw.user.name,
        password: raw.user.password,
        curriculumId: raw.curriculumId,
        registration: raw.registration,
        studentId: new UniqueEntityID(raw.id),
        city: raw.user.city,
        state: raw.user.state,
        courseName: raw.curriculum.courseName,
        university: University.create(
          {
            name: raw.curriculum.university.name,
            abv: raw.curriculum.university.abv,
            city: raw.curriculum.university.city,
            state: raw.curriculum.university.state,
          },
          new UniqueEntityID(raw.curriculum.university.id),
        ),
        username: raw.user.username,
        lastname: raw.user.lastname,
        currentSemester: raw.currentSemester,
        enrollmentSemester: raw.enrollmentSemester,
        enrollmentYear: raw.enrollmentYear,
        avatar: raw.user.avatar, 
        inative: raw.user.inative,
        recoverToken: raw.user.recoverToken,
        salt: raw.user.salt
      },
      new UniqueEntityID(raw.user.id),
    );
  }
}

export type RawStudent = RawStudentPrisma & {
  user: User;
  curriculum: CurriculumPrisma & {
    university: UniversityPrisma;
  };
};
