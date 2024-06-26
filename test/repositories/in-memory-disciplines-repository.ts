import { Discipline } from '@application/entities/discipline/discipline';
import { DisciplinesRepository } from '@application/repositories/disciplines-repository';

export class InMemoryDisciplinesRepository implements DisciplinesRepository {
  createMany(disciplines: Discipline[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByCodArray(cods: string[]): Promise<Discipline[]> {
    throw new Error('Method not implemented.');
  }
  public disciplines: Discipline[] = [];

  async findById(disciplineId: string): Promise<Discipline | null> {
    const discipline = this.disciplines.find(
      (item) => item.id.toString() === disciplineId,
    );

    if (!discipline) {
      return null;
    }

    return discipline;
  }

  async findByCod(cod: string): Promise<Discipline | null> {
    const discipline = this.disciplines.find((item) => item.cod === cod);

    if (!discipline) {
      return null;
    }

    return discipline;
  }

  async findByCurriculum(curriculumId: string): Promise<Discipline[] | []> {
    const disciplinesSearched = this.disciplines.filter(
      (item) => item.curriculumId.toString() === curriculumId,
    );

    return disciplinesSearched;
  }


  async create(discipline: Discipline) {
    this.disciplines.push(discipline);
  }

  async save(discipline: Discipline): Promise<Discipline> {
    const index = this.disciplines.findIndex(
      (item) => item.id === discipline.id,
    );

    if (index >= 0) {
      this.disciplines[index] = discipline;
    }
    return this.disciplines[index];
  }

  async list(): Promise<Discipline[] | []> {
    return this.disciplines;
  }

  async delete(disciplineId: string): Promise<void> {
    const disciplinesIndex = this.disciplines.findIndex(
      (item) => item.id.toString() === disciplineId,
    );

    if (disciplinesIndex >= 0) {
      this.disciplines.splice(disciplinesIndex, 1);
    }
  }
}
