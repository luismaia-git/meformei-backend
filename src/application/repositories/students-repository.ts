import { Student } from '../entities/student/student';

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<Student>;
  abstract findById(studentId: string): Promise<Student | null>;
  abstract save(student: Student): Promise<Student>;
  abstract delete(studentId: string): Promise<void>;
  abstract list(): Promise<Student[] | []>;
  abstract findByEmailAndUserName(
    request: FindByEmailAndUserNameRequest,
  ): Promise<Student | null>;
  abstract findByUsername(username: string): Promise<Student | null>;
  abstract findByEmail(email: string): Promise<Student | null>;
  abstract findByUserId(userId: string): Promise<Student | null>;
  abstract findByRegistration(registration: string): Promise<Student | null>;
}

interface FindByEmailAndUserNameRequest {
  email: string;
  username: string;
}
