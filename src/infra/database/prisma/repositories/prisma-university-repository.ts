import { Injectable } from '@nestjs/common';
import { University } from 'src/application/entities/curriculum/university';
import { UniversitiesRepository } from 'src/application/repositories/universities-repository';
import { PrismaUniversityMapper } from '../mappers/prisma-university-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUniversitiesRepository implements UniversitiesRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<University | null> {
    const university = await this.prisma.university.findUnique({
      where: {
        name,
      },
      include: {
        curriculums: true,
      },
    });

    if (!university) {
      return null;
    }

    return PrismaUniversityMapper.toDomain(university);
  }

  async findByAbv(abv: string): Promise<University | null> {
    const university = await this.prisma.university.findUnique({
      where: {
        abv,
      },
      include: {
        curriculums: true,
      },
    });

    if (!university) {
      return null;
    }

    return PrismaUniversityMapper.toDomain(university);
  }

  async findById(universityId: string): Promise<University | null> {
    const university = await this.prisma.university.findUnique({
      where: {
        id: universityId,
      },
      include: {
        curriculums: true,
      },
    });

    if (!university) {
      return null;
    }

    return PrismaUniversityMapper.toDomain(university);
  }

  async findByCity(city: string): Promise<University[]> {
    const universities = await this.prisma.university.findMany({
      where: {
        city: city,
      },
      include: {
        curriculums: true,
      },
    });

    return universities.map(PrismaUniversityMapper.toDomain);
  }

  async findByState(state: string): Promise<University[]> {
    const universities = await this.prisma.university.findMany({
      where: {
        state: state,
      },
      include: {
        curriculums: true,
      },
    });

    return universities.map(PrismaUniversityMapper.toDomain);
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

  async create(university: University): Promise<void> {
    const raw = PrismaUniversityMapper.toPrisma(university);

    await this.prisma.university.create({
      data: raw,
    });
  }

  async list(): Promise<University[]> {
    const universities = await this.prisma.university.findMany({
      include: {
        curriculums: true,
      },
    });

    return universities.map(PrismaUniversityMapper.toDomain);
  }

  async delete(universityId: string): Promise<void> {
    await this.prisma.university.delete({
      where: {
        id: universityId,
      },
    });
  }

  async save(university: University): Promise<University> {
    const raw = PrismaUniversityMapper.toPrisma(university);
    const uni = await this.prisma.university.update({
      where: { id: university.id.toString() },
      data: raw,
      include: { curriculums: true },
    });
    return PrismaUniversityMapper.toDomain(uni);
  }
}
