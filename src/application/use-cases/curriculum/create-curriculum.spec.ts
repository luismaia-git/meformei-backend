import { makeUniversity } from '@test/factories/university-factory';
import { InMemoryCurriculumsRepository } from '@test/repositories/in-memory-curriculums-repository';
import { InMemoryUniversitiesRepository } from '@test/repositories/in-memory-universities-repository';
import { UniversityNotFound } from '../errors/university-not-found';
import { CreateCurriculum } from './create-curriculum';

describe('Create curriculum', () => {
  it('should be able to create a curriculum', async () => {
    const curriculumsRepository = new InMemoryCurriculumsRepository();
    const universitiesRepository = new InMemoryUniversitiesRepository();

    const university = makeUniversity();
    universitiesRepository.create(university);

    const createCurriculum = new CreateCurriculum(
      curriculumsRepository,
      universitiesRepository,
    );

    const { curriculum } = await createCurriculum.execute({
      courseName: '',
      description: '',
      requiredHours: 0,
      optionalHours: 0,
      extraCurricularHours: 0,
      universityId: university.id.toString(),
    });

    expect(curriculumsRepository.curriculums).toHaveLength(1);
    expect(curriculumsRepository.curriculums[0]).toEqual(curriculum);
  });

  it('should not be able to create a durriculum if non existing university', async () => {
    const curriculumsRepository = new InMemoryCurriculumsRepository();
    const universitiesRepository = new InMemoryUniversitiesRepository();

    const createCurriculum = new CreateCurriculum(
      curriculumsRepository,
      universitiesRepository,
    );

    expect(() => {
      return createCurriculum.execute({
        courseName: 'course name example',
        description: 'example description',
        requiredHours: 0,
        optionalHours: 0,
        extraCurricularHours: 0,
        universityId: 'fake-id',
      });
    }).rejects.toThrow(UniversityNotFound);
  });
});
