import { User } from '@application/entities/user/user';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { User as RawUserPrisma } from '@prisma/client';

export class PrismaUserMapper {
  static toPrisma(user: User) {
    const {id, name, lastname, email, password, username, avatar, city, state,inative, recoverToken, salt, createdAt } = user
    return {
      id: id.toString(),
      name,
      lastname,
      username,
      email,
      password,
      state,
      city,
      recoverToken,
      salt,
      inative,
      avatar,
      createdAt,
    };
  }

  static toDomain(raw: RawUser): User {
    const {
      id,
      name,
      lastname,
      username,
      email,
      password,
      state,
      city,
      recoverToken,
      salt,
      inative,
      avatar,
      createdAt
    } = raw
    return User.create(
      {
        name,
        lastname,
        username,
        email,
        password,
        state,
        city,
        recoverToken,
        salt,
        inative,
        avatar,
        createdAt
      },
      new UniqueEntityID(id),
    );
  }
}

type RawUser = RawUserPrisma;
