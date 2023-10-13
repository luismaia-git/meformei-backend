import { StudentsRepository } from '@application/repositories/students-repository';
import { Injectable } from '@nestjs/common';

interface CheckStudentAccountEmailResquest {
  email: string;
}

@Injectable()
export class CheckStudentAccountEmail {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(request: CheckStudentAccountEmailResquest) {
    const { email } = request;
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return false;
    }

    return true;
  }
}
