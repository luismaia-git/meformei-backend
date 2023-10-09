import { Student } from '@application/entities/student/student';
import { User } from '@application/entities/user/user';
import { CurriculumsRepository } from '@application/repositories/curriculums-repository';
import { StudentsRepository } from '@application/repositories/students-repository';
import { UsersRepository } from '@application/repositories/users-repository';
import { CreateStudentBody } from '@infra/http/dto/student/create-student.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CurriculumNotFound } from '../errors/curriculum-not-found';
import { UserAlreadyExists } from '../errors/user-already-exists';

@Injectable()
export class RegisterAccountStudent {
  constructor(
    private studentsRepository: StudentsRepository,
    private usersRepository: UsersRepository,
    private curriculumsRepository: CurriculumsRepository,
  ) {}

  async execute(request: CreateStudentBody) {
    const {
      lastname,
      username,
      curriculumId,
      email,
      name,
      password,
      registration,
      enrollmentSemester,
      enrollmentYear,
      city,
      state,
    } = request;

    const UserAlreadyExist = await this.usersRepository.findByUsername(username)

    
    if (UserAlreadyExist) {
      throw new UserAlreadyExists();
    }

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
      state: state,
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
      },
      user.id,
    );

    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(
      user.password,
      user.salt,
    );

    user.recoverToken = null;

    await this.studentsRepository.create(student);

    return {
      student,
      user,
    };
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
