import { Injectable } from '@nestjs/common';

import { Student } from '@application/entities/student/student';
import { User } from '@application/entities/user/user';
import { CurriculumsRepository } from '@application/repositories/curriculums-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { UsersRepository } from '@application/repositories/users-repository';
import { CurriculumNotFound } from '../errors/curriculum-not-found';

interface CreateStudentRequest {
  registration: string;
  curriculumId: string;
  name: string;
  email: string;
  password: string;
  city: string;
  state: string;
  lastname: string;
  username: string;
  enrollmentSemester: number;
  enrollmentYear: number;
}

interface CreateStudentResponse {
  student: Student;
  user: User;
}

@Injectable()
export class CreateStudent {
  constructor(
    private studentsRepository: StudentsRepository,
    private usersRepository: UsersRepository,
    private curriculumsRepository: CurriculumsRepository,
  ) {}

  async execute(request: CreateStudentRequest): Promise<CreateStudentResponse> {
    const {
      city,
      state,
      lastname,
      username,
      curriculumId,
      email,
      name,
      password,
      registration,
      enrollmentSemester,
      enrollmentYear,
    } = request;

    const curriculum = await this.curriculumsRepository.findById(curriculumId);

    if (!curriculum) {
      throw new CurriculumNotFound();
    }

    const user = User.create({
      name,
      email,
      password,
      city,
      lastname,
      username,
      state,
      avatar: null,
      inative: null,
    });

    const student = Student.create(
      {
        curriculumId,
        registration,
        name,
        email,
        password,
        city,
        courseName: curriculum.courseName,
        enrollmentSemester,
        enrollmentYear,
        lastname,
        state: state,
        university: curriculum.university,
        username,
        avatar: null,
        inative: null,
        createdAt: null,
      },
      user.id,
    );

    await this.studentsRepository.create(student);

    return {
      student,
      user,
    };
  }
}
