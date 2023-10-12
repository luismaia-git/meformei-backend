import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Admin as RawAdminPrisma, User } from '@prisma/client';
import { Admin } from 'src/application/entities/admin/admin';

export class PrismaAdminMapper {
  static toPrisma(admin: Admin) {
    return {
      user: {
        id: admin.id.toString(),
        name: admin.name,
        lastname: admin.lastname,
        email: admin.email,
        username: admin.username,
        password: admin.password,
        state: admin.state,
        city: admin.city,
        avatar: admin.avatar,
        inative: admin.inative,
        recoverToken: admin.recoverToken,
        salt: admin.salt
      },
      admin:{
        id: admin.adminId.toString(),
        userId: admin.id.toString()
      }
    };
  }

  static toDomain(raw: RawAdmin): Admin {
    return Admin.create(
      {
        email: raw.user.email,
        name: raw.user.name,
        password: raw.user.password,
        adminId: new UniqueEntityID(raw.id),
        city: raw.user.city,
        state: raw.user.state,
        lastname: raw.user.lastname,
        username: raw.user.username,
        avatar: raw.user.avatar,
        inative: raw.user.inative,
        recoverToken: raw.user.recoverToken,
        salt: raw.user.salt
      },
      new UniqueEntityID(raw.user.id),
    );
  }
}

type RawAdmin = RawAdminPrisma & {
  user: User;
};
