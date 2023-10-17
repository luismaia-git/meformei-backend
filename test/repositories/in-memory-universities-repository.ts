import { University } from '@application/entities/curriculum/university';
import { UniversitiesRepository } from '@application/repositories/universities-repository';

export class InMemoryUniversitiesRepository implements UniversitiesRepository {
 
  async findByName(name: string): Promise<University> {
    const university = this.universities.find(
      (item) => item.name.toString() === name,
    );

    if (!university) {
      return null;
    }

    return university;
  }

  async findByAbv(abv: string): Promise<University> {
    const university = this.universities.find(
      (item) => item.abv.toString() === abv,
    );

    if (!university) {
      return null;
    }

    return university;
  }

  public universities: University[] = [];

  async findById(universityId: string): Promise<University | null> {
    const university = this.universities.find(
      (item) => item.id.toString() === universityId,
    );

    if (!university) {
      return null;
    }

    return university;
  }

  async create(university: University) {
    this.universities.push(university);
  }

  async save(university: University): Promise<University> {
    const index = this.universities.findIndex(
      (item) => item.id === university.id,
    );

    if (index >= 0) {
      this.universities[index] = university;
    }
    return this.universities[index];
  }

  async list(): Promise<University[] | []> {
    return this.universities;
  }

  async delete(universityId: string): Promise<void> {
    const universitiesIndex = this.universities.findIndex(
      (item) => item.id.toString() === universityId,
    );

    if (universitiesIndex >= 0) {
      this.universities.splice(universitiesIndex, 1);
    }
  }

  async findByCity(city: string): Promise<University[]> {
    return this.universities.filter((university) => university.city === city);
  }

  async findByState(state: string): Promise<University[]> {
    return this.universities.filter((university) => university.state === state);
  }
}
