import { University } from '@application/entities/curriculum/university';
export abstract class UniversitiesRepository {
  abstract create(university: University): Promise<void>;
  abstract findById(universityId: string): Promise<University | null>;
  abstract save(university: University): Promise<University>;
  abstract delete(universityId: string): Promise<void>;
  abstract list(): Promise<University[]>;
  abstract findByState(state: string): Promise<University[]>;
  abstract findByCity(city: string): Promise<University[]>;
  abstract findByName(name: string): Promise<University | null>;
  abstract findByAbv(abv: string): Promise<University | null>;
}
