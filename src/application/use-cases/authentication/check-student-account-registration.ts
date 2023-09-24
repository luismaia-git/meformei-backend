import { StudentsRepository } from '@application/repositories/students-repository';
import { Injectable } from '@nestjs/common';

interface CheckStudentAccountRegistrationResquest {
  registration: string;
}

@Injectable()
export class CheckStudentAccountByRegistration {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(request: CheckStudentAccountRegistrationResquest) {
    const { registration } = request;
    const student = await this.studentsRepository.findById(registration);

    if (!student) {
      return false;
    }

    return true;
  }
}
