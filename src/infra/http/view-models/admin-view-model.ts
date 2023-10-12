import { Admin } from '@application/entities/admin/admin';
import { ApiProperty } from '@nestjs/swagger';

export class AdminViewModel {
  @ApiProperty()
  static toHTTP(admin: Admin) {
    const { email, id, name, city, state, lastname, username, adminId, inative, avatar, createdAt } = admin;

    return {
      id: id.toValue(),
      name,
      email,
      lastname,
      inative,
      avatar,
      adminId: adminId.toValue(),
      username,
      city,
      state,
      createdAt
    };
  }
}
