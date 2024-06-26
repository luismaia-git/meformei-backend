import { Injectable } from '@nestjs/common';

import { Curriculum } from '@application/entities/curriculum/curriculum';
import {
  CurriculumsRepository,
  findByUniversityIdAndCurriculumIdRequest,
} from '@application/repositories/curriculums-repository';
import { PrismaCurriculumMapper } from '../mappers/prisma-curriculum-mapper';
import { PrismaService } from '../prisma.service';

//....
@Injectable()
export class PrismaCurriculumsRepository implements CurriculumsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(curriculumId: string): Promise<Curriculum | null> {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: {
        id: curriculumId,
      },
      include: {
        university: true,
        // disciplines: {
        //   include: {
        //     prerequisitesDisciplines: true,
        //     curriculum: {
        //       include: {
        //         course: true,
        //         university: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    if (!curriculum) {
      return null;
    }

    return PrismaCurriculumMapper.toDomain(curriculum);
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

  async create(curriculum: Curriculum): Promise<void> {
    const raw = PrismaCurriculumMapper.toPrisma(curriculum);

    await this.prisma.curriculum.create({
      data: raw,
    });
  }

  async save(curriculum: Curriculum): Promise<Curriculum> {
    const raw = PrismaCurriculumMapper.toPrisma(curriculum);

    const curriculumFinded = await this.prisma.curriculum.update({
      where: {
        id: raw.id,
      },
      include: {
        university: true,
      },
      data: raw,
    });

    return PrismaCurriculumMapper.toDomain(curriculumFinded);
  }

  async list(): Promise<Curriculum[] | []> {
    const curriculums = await this.prisma.curriculum.findMany({
      include: {
        university: true,
        disciplines: {
          include: {
            prerequisitesDisciplines: true,
            curriculum: {
              include: {
                university: true,
              },
            },
          },
        },
      },
    });

    return curriculums.map(PrismaCurriculumMapper.toDomain);
  }

  async delete(curriculumId: string): Promise<void> {
    await this.prisma.curriculum.delete({
      where: {
        id: curriculumId,
      },
    });
  }

  async findByUniversityId(universityId: string): Promise<Curriculum[] | []> {
    const curriculums = await this.prisma.curriculum.findMany({
      where: {
        universityId: universityId,
      },
      include: {
        university: true,
      },
    });

    if (!curriculums) {
      return null;
    }

    return curriculums.map(PrismaCurriculumMapper.toDomain);
  }

  async findByUniversityIdAndCurriculumId(
    request: findByUniversityIdAndCurriculumIdRequest,
  ): Promise<Curriculum | null> {
    const { curriculumId, universityId } = request;
    const curriculum = await this.prisma.curriculum.findFirst({
      where: {
        universityId,
        id: curriculumId,
      },
      include: {
        university: true,
      },
    });

    if (!curriculum) {
      return null;
    }

    return PrismaCurriculumMapper.toDomain(curriculum);
  }
}
