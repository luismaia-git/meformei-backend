import { Injectable } from '@nestjs/common';

import { Admin } from 'src/application/entities/admin/admin';
import { AdminsRepository } from 'src/application/repositories/admins-repository';
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(adminId: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      include: {
        user: true,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  // async findManyByAnyId(anyId: string): Promise<Admin[]> {
  //   const students = await this.prisma.student.findMany({
  //     where: {
  //       anyId,
  //     },
  //   });

  //   return students.map(PrismaAdminMapper.toDomain);
  // }

  // async countManyByAnyId(anyId: string): Promise<number> {
  //   const count = await this.prisma.student.count({
  //     where: {
  //       anyId,
  //     },
  //   });

  //   return count;
  // }

  async create(admin: Admin): Promise<Admin> {
    const { admin: rawAdmin, user: rawUser } = PrismaAdminMapper.toPrisma(admin);

    const adminCreated = await this.prisma.admin.create({
      data: {id: rawAdmin.id, user: { create: rawUser}},
      include: {
        user:true
      }
    });
  
    return PrismaAdminMapper.toDomain(adminCreated)
  }

  async update(admin: Admin): Promise<Admin> {
    const { user: rawUser, admin: rawAdmin} = PrismaAdminMapper.toPrisma(admin);

    const adminFinded = await this.prisma.admin.update({
      where: {
        id: rawAdmin.id,
      },
      include: {
        user: true,
      },
      data: { id: rawAdmin.id, user: {update: rawUser}},
    });

    return PrismaAdminMapper.toDomain(adminFinded);
  }
  async list(): Promise<Admin[] | []> {
    const admin = await this.prisma.admin.findMany({
      include: { user: true },
    });

    return admin.map(PrismaAdminMapper.toDomain);
  }

  async delete(adminId: string): Promise<void> {
    await this.prisma.admin.delete({
      where: {
        id: adminId,
      },
    });
  }

  async findByEmailOrUserName(
    request: FindByEmailAndUserNameRequest,
  ): Promise<Admin | null> {
    const { email, username } = request;

    const admin = await this.prisma.admin.findFirst({
      where: {
        OR: [{user: {email, username}}]
      },
      include: {
        user: true,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: { user: { username } },
      include: {
        user: true,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async findByUserId(userId: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: { user: { email } },
      include: {
        user: true,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }
}
interface FindByEmailAndUserNameRequest {
  email: string;
  username: string;
}
