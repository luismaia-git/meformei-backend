import { Student, StudentProps } from '@application/entities/student/student';
import { makeUniversity } from './university-factory';

type Override = Partial<StudentProps>;

export function makeStudent(override: Override = {}) {
  return Student.create({
    name: 'Example name',
    email: 'email@example.com',
    password: 'password123',
    curriculumId: 'example-curriculum-id',
    registration: '0000001',
    username: 'Example username',
    city: 'example city',
    courseName: 'Example course name',
    currentSemester: 1,
    enrollmentSemester: 1,
    enrollmentYear: 2021,
    lastname: 'Example lastname',
    state: 'Example state',
    inative: null,
    avatar: 'Example',
    university: makeUniversity(),
    ...override,
  });
}
