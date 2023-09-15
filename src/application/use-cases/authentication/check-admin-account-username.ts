import { AdminsRepository } from '@application/repositories/admins-repository';
import { Injectable } from '@nestjs/common';

interface CheckAdminAccountUsernameResquest {
  username: string;
}

@Injectable()
export class CheckAdminAccountUsername {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute(request: CheckAdminAccountUsernameResquest) {
    const { username } = request;
    const admin = await this.adminsRepository.findByUsername(username);

    if (!admin) {
      return false;
    }

    return true;
  }
}
