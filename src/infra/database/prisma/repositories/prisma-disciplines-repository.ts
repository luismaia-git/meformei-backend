import { Injectable } from '@nestjs/common';
import { Discipline } from 'src/application/entities/discipline/discipline';
import { DisciplinesRepository } from 'src/application/repositories/disciplines-repository';
import { PrismaDisciplineMapper } from '../mappers/prisma-discipline-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDisciplinesRepository implements DisciplinesRepository {
  constructor(private prisma: PrismaService) {}
  async findByCodArray(cods: string[]): Promise<Discipline[]> {
    const disciplines = await this.prisma.discipline.findMany({
      where: {
        cod: { in: cods },
      },
    });
    return disciplines.map(PrismaDisciplineMapper.toDomain);
  }
  // prerequisites: {
  //   connect: discipline.prerequisiteDisciplines.map((cod: string) => {
  //     return { cod: cod };
  //   }),
  // },
  async createMany(disciplines: Discipline[]): Promise<void> {
    const disciplinesMapped = disciplines.map((discipline) => {
      return {
        ...PrismaDisciplineMapper.toPrisma(discipline),
      };
    });

    const rawArray = disciplinesMapped.map(
      ({ prerequisitesDisciplines, ...rest }) => rest,
    );

    await this.prisma.discipline.createMany({
      data: rawArray,
    });

    const idsDisciplinas = disciplinesMapped.map((disciplina) => disciplina.id);

    await Promise.all(
      disciplinesMapped.map(async (disciplina, index) => {
        const { prerequisitesDisciplines } = disciplina;
        await this.prisma.discipline.update({
          where: { id: idsDisciplinas[index] },
          data: {
            prerequisitesDisciplines: {
              connect: prerequisitesDisciplines.map((cod) => ({ cod })),
            },
          },
        });
      }),
    );
  }

  async findById(disciplineId: string): Promise<Discipline | null> {
    const discipline = await this.prisma.discipline.findUnique({
      where: {
        id: disciplineId,
      },
      include: {
        prerequisitesDisciplines: true,
      },
    });

    if (!discipline) {
      return null;
    }
    return PrismaDisciplineMapper.toDomain(discipline);
  }

  async findByCod(cod: string): Promise<Discipline | null> {
    const discipline = await this.prisma.discipline.findFirst({
      where: {
        cod: cod,
      },
      include: {
        prerequisitesDisciplines: true,
      },
    });

    if (!discipline) {
      return null;
    }

    return PrismaDisciplineMapper.toDomain(discipline);
  }

  async findByCurriculum(curriculumSearch: string): Promise<Discipline[] | []> {
    const disciplines = await this.prisma.discipline.findMany({
      where: {
        curriculumId: curriculumSearch,
      },
      include: {
        prerequisitesDisciplines: true,
      },
    });

    return disciplines.map(PrismaDisciplineMapper.toDomain);
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

  async create(discipline: Discipline): Promise<void> {
    const raw = PrismaDisciplineMapper.toPrisma(discipline);

    await this.prisma.discipline.create({
      data: {
        ...raw,
        prerequisitesDisciplines: {
          connect: raw.prerequisitesDisciplines.map((cod: string) => {
            return { cod: cod };
          }),
        },
      },
    });
  }

  async list(): Promise<Discipline[] | []> {
    const disciplines = await this.prisma.discipline.findMany();

    return disciplines.map(PrismaDisciplineMapper.toDomain);
  }

  async delete(disciplineId: string): Promise<void> {
    await this.prisma.discipline.delete({
      where: {
        id: disciplineId,
      },
    });
  }

  async save(discipline: Discipline): Promise<Discipline> {
    const raw = PrismaDisciplineMapper.toPrisma(discipline);

    const disciplineFinded = await this.prisma.discipline.update({
      where: {
        id: raw.id,
      },
      include: {
        prerequisitesDisciplines: true,
      },
      data: {
        ...raw,
        prerequisitesDisciplines: {
          connect: raw.prerequisitesDisciplines.map((cod: string) => {
            return { cod: cod };
          }),
        },
      },
    });

    return PrismaDisciplineMapper.toDomain(disciplineFinded);
  }
}
