import { Curriculum } from '@application/entities/curriculum/curriculum';

export abstract class CurriculumsRepository {
  abstract create(curriculum: Curriculum): Promise<void>;
  abstract findById(curriculumId: string): Promise<Curriculum | null>;
  abstract findByUniversityId(universityId: string): Promise<Curriculum[] | []>;
  abstract findByUniversityIdAndCurriculumId(
    request: findByUniversityIdAndCurriculumIdRequest,
  ): Promise<Curriculum | null>;
  abstract save(curriculum: Curriculum): Promise<Curriculum>;
  abstract delete(curriculumId: string): Promise<void>;
  abstract list(): Promise<Curriculum[] | []>;
}

export interface findByUniversityIdAndCurriculumIdRequest {
  universityId: string;
  curriculumId: string;
}
