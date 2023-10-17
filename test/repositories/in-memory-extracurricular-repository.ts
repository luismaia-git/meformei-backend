import { ExtraCurricular } from '@application/entities/extracurricular-activities/extracurricular-activities';
import { ExtraCurricularRepository } from '@application/repositories/extracurricular-repository';

export class InMemoryExtraCurricularRepository
  implements ExtraCurricularRepository
{
  async findByStudentId(studentId: string): Promise<ExtraCurricular[] | []> {
    const exc = this.extraCurricularActivities.filter(
      (item) => item.studentId.toString() === studentId,
    );

    if (!exc) {
      return null;
    }

    return exc;
  }
  public extraCurricularActivities: ExtraCurricular[] = [];

  async findById(extraCurricularId: string): Promise<ExtraCurricular | null> {
    const exc = this.extraCurricularActivities.find(
      (item) => item.id.toString() === extraCurricularId,
    );

    if (!exc) {
      return null;
    }

    return exc;
  }

  async findByStudentRegistration(
    studentRegistration: string,
  ): Promise<ExtraCurricular[] | []> {
    const exc = this.extraCurricularActivities.filter(
      (item) => item.studentId.toString() === studentRegistration,
    );

    if (!exc) {
      return null;
    }

    return exc;
  }


  async create(extraCurricular: ExtraCurricular) {
    this.extraCurricularActivities.push(extraCurricular);
  }

  async save(extraCurricular: ExtraCurricular): Promise<ExtraCurricular> {
    const index = this.extraCurricularActivities.findIndex(
      (item) => item.id === extraCurricular.id,
    );

    if (index >= 0) {
      this.extraCurricularActivities[index] = extraCurricular;
      return this.extraCurricularActivities[index];
    }
  }

  async list(): Promise<ExtraCurricular[] | []> {
    return this.extraCurricularActivities;
  }

  async delete(extraCurricularId: string): Promise<void> {
    const index = this.extraCurricularActivities.findIndex(
      (item) => item.id.toString() === extraCurricularId,
    );

    if (index >= 0) {
      this.extraCurricularActivities.splice(index, 1);
    }
  }
}
