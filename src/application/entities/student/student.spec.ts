import { makeUniversity } from '@test/factories/university-factory';
import { Student } from './student';

describe('Student', () => {
  it('should be able to create a student', () => {
    const student = Student.create({
      name: 'Example name',
      email: 'email@example.com',
      password: 'password123',
      curriculumId: 'example-curriculum-id',
      registration: '0000001',
      username: 'Example username',
      city: 'example city',
      courseName: 'curso',
      enrollmentSemester: 2,
      enrollmentYear: 2021,
      lastname: 'Example lastname',
      state: 'Example state',
      university: makeUniversity(),
      avatar: '',
      inative: null,
    });

    expect(student).toBeTruthy();
  });
});
