import { makeStudent } from '@test/factories/student-factory';
import { InMemoryExtraCurricularRepository } from '@test/repositories/in-memory-extracurricular-repository';
import { InMemoryStudentsRepository } from '@test/repositories/in-memory-students-repository';
import { CreateExtraCurricularActivity } from './create-extracurricular-activity';

describe('Create ExtraCurricular Activity', () => {
  it('should be able to create a ExtraCurricular Activity', async () => {
    const extraCurricularRepository = new InMemoryExtraCurricularRepository();
    const studentRepository = new InMemoryStudentsRepository();
    
    const student = makeStudent()
    
    studentRepository.create(student)
    
    const createExtraCurricularActivity = new CreateExtraCurricularActivity(
      extraCurricularRepository, studentRepository
    );

    const { extraCurricularActivity } =
      await createExtraCurricularActivity.execute({
        activityType: 'example',
        atUfc: false,
        endDate: new Date(),
        hours: 1,
        institutionName: 'example',
        situation: 'DEFERIDO',
        startDate: new Date(),
        studentId: student.studentId.toString(),
        title: 'example',
        institutionCnpj: 'example',
        institutionCountry: 'example',
        participationType: 'example',
      });

    expect(extraCurricularRepository.extraCurricularActivities).toHaveLength(1);
    expect(extraCurricularRepository.extraCurricularActivities[0]).toEqual(
      extraCurricularActivity,
    );
  });
});
