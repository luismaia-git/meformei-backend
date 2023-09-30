import {
  Curriculum,
  CurriculumProps,
} from '@application/entities/curriculum/curriculum';

import { makeUniversity } from './university-factory';

type Override = Partial<CurriculumProps>;

export function makeCurriculum(override: Override = {}) {
  return Curriculum.create({
    courseName: 'Example course name',
    description: 'Example description',
    university: makeUniversity(),
    extraCurricularHours: 192,
    optionalHours: 1200,
    requiredHours: 3200,
    ...override,
  });
}
