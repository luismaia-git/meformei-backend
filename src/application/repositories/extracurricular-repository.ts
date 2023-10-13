import { ExtraCurricular } from '@application/entities/extracurricular-activities/extracurricular-activities';

export abstract class ExtraCurricularRepository {
  abstract create(extraCurricular: ExtraCurricular): Promise<void>;
  abstract save(extraCurricular: ExtraCurricular): Promise<ExtraCurricular>;
  abstract delete(extraCurricularId: string): Promise<void>;
  abstract list(): Promise<ExtraCurricular[] | []>;
  abstract findById(extraCurricularId: string): Promise<ExtraCurricular | null>;
  abstract findByStudentId(
    studentId: string,
  ): Promise<ExtraCurricular[] | []>;
}
