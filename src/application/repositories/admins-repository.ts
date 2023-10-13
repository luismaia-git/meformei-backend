import { Admin } from '../entities/admin/admin';

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<Admin>;
  abstract save(admin: Admin): Promise<Admin>;
  abstract delete(adminId: string): Promise<void>;
  abstract list(): Promise<Admin[] | []>;
  abstract findById(adminId: string): Promise<Admin | null>;
  abstract findByUsername(username: string): Promise<Admin | null>;
  abstract findByEmailOrUserName(
    request: FindByEmailAndUserNameRequest,
  ): Promise<Admin | null>;
  abstract findByUserId(userId: string): Promise<Admin | null>;
  abstract findByEmail(email: string): Promise<Admin | null>;

  // abstract countManyByAnyId(anyId: string): Promise<number>;
  // abstract findManyByAnyId(anyId: string): Promise<Admin[]>;
}

interface FindByEmailAndUserNameRequest {
  email: string;
  username: string;
}
