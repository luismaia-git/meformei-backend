import { Injectable } from '@nestjs/common';
import { Student } from 'src/application/entities/student/student';
import { StudentsRepository } from 'src/application/repositories/students-repository';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(studentId: string): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        user: true,
        curriculum: {
          include: {
            university: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  // async findManyByAnyId(anyId: string): Promise<Student[]> {
  //   const students = await this.prisma.student.findMany({
  //     where: {
  //       anyId,
  //     },
  //   });

  //   return students.map(PrismaStudentMapper.toDomain);
  // }

  // async countManyByAnyId(anyId: string): Promise<number> {
  //   const count = await this.prisma.student.count({
  //     where: {
  //       anyId,
  //     },
  //   });

  //   return count;
  // }

  async create(student: Student): Promise<void> {
    const {student: rawStudent} = PrismaStudentMapper.toPrisma(student);

    await this.prisma.student.create({
      data: rawStudent,
    });
  }    

  async update(student: Student): Promise<Student> {
    const { user: rawUser, student: rawStudent} = PrismaStudentMapper.toPrisma(student);
    const studentUpdated = await this.prisma.student.update({
      where: {
        id: rawStudent.id,
      },
      include: {
        user: true,
        curriculum: { include: { university: true } },
      },
      data: {
        id: rawStudent.id,
        enrollmentSemester: rawStudent.enrollmentSemester,
        currentSemester: rawStudent.currentSemester,
        registration: rawStudent.registration,
        enrollmentYear: rawStudent.enrollmentYear,
        user:{update: rawUser}}
    });

    return PrismaStudentMapper.toDomain(studentUpdated);
  }

  async list(): Promise<Student[] | []> {
    const students = await this.prisma.student.findMany({
      include: {
        user: true,
        curriculum: {
          include: {
            university: true,
          },
        },
      },
    });

    return students.map(PrismaStudentMapper.toDomain);
  }

  async delete(studentId: string): Promise<void> {
    await this.prisma.student.delete({
      where: {
        id: studentId,
      },
    });
  }

  async findByEmailAndUserName(
    request: FindByEmailAndUserNameRequest,
  ): Promise<Student | null> {
    const { email, username } = request;
    const student = await this.prisma.student.findFirst({
      where: {
        OR: {
          user: {
            email,
            username,
          },
        },
      },
      include: {
        user: true,
        curriculum: {
          include: {
            university: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async findByUsername(username: string): Promise<Student | null> {
    const student = await this.prisma.student.findFirst({
      where: { user: { username } },
      include: {
        user: true,
        curriculum: {
          include: {
            university: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const student = await this.prisma.student.findFirst({
      where: { userId },
      include: {
        user: true,
        curriculum: {
          include: {
            university: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.student.findFirst({
      where: { user: { email } },
      include: {
        user: true,
        curriculum: {
          include: {
            university: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }
}

interface FindByEmailAndUserNameRequest {
  email: string;
  username: string;
}
