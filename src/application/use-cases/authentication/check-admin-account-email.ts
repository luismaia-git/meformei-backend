import { AdminsRepository } from '@application/repositories/admins-repository';
import { Injectable } from '@nestjs/common';

interface CheckAdminAccountEmailResquest {
  email: string;
}

@Injectable()
export class CheckAdminAccountEmail {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute(request: CheckAdminAccountEmailResquest) {
    const { email } = request;
    const admin = await this.adminsRepository.findByEmail(email);

    if (!admin) {
      return false;
    }

    return true;
  }
}
