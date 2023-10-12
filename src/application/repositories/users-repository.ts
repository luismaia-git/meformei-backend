import { User } from '../entities/user/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(userId: string): Promise<User | null>;
  abstract update(user: User): Promise<void>;
  abstract delete(userId: string): Promise<void>;
  abstract list(): Promise<User[] | []>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByRecoverToken(recoverToken: string): Promise<User | null>;
  // abstract countManyByAnyId(anyId: string): Promise<number>;
  // abstract findManyByAnyId(anyId: string): Promise<Admin[]>;
}
