import { StudentsRepository } from '@application/repositories/students-repository';
import { Injectable } from '@nestjs/common';

interface CheckStudentAccountUsernameResquest {
  username: string;
}

@Injectable()
export class CheckStudentAccountUsername {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(request: CheckStudentAccountUsernameResquest) {
    const { username } = request;
    const student = await this.studentsRepository.findByUsername(username);

    if (!student) {
      return false;
    }

    return true;
  }
}
