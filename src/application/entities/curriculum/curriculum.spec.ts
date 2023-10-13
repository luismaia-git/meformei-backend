import { makeUniversity } from '@test/factories/university-factory';
import { Curriculum } from './curriculum';

describe('Curriculum', () => {
  it('should be able to create a curriculum', () => {
    const university = makeUniversity();
    const curriculum = Curriculum.create({
      courseName: 'course Name example',
      description: 'Example description',
      university: university,
      extraCurricularHours: 192,
      optionalHours: 1200,
      requiredHours: 3200,
    });

    expect(curriculum).toBeTruthy();
  });
});
