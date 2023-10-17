import { makeStudent } from '@test/factories/student-factory';
import { InMemoryCourseHistoryRepository } from '@test/repositories/im-memory-course-history-repository';
import { InMemoryStudentsRepository } from '@test/repositories/in-memory-students-repository';
import { StudentNotFound } from '../errors/student-not-found';
import { DeleteStudent } from './delete-student';

describe('Delete student', () => {
  it('should be able to delete a student', async () => {
    const studentsRepository = new InMemoryStudentsRepository();
    const courseHistory = new InMemoryCourseHistoryRepository()
    const student = makeStudent();
    studentsRepository.create(student);

    const deleteStudent = new DeleteStudent(studentsRepository, courseHistory);

    const { student: studentDeleted } = await deleteStudent.execute({
      studentId: student.studentId.toString(),
    });

    expect(studentsRepository.students).toHaveLength(0);
    expect(student).toEqual(studentDeleted);
  });

  it('should not be able to delete a student if non existing student', async () => {
    const studentsRepository = new InMemoryStudentsRepository();
    const courseHistory = new InMemoryCourseHistoryRepository()
    const deleteStudent = new DeleteStudent(studentsRepository, courseHistory);

    expect(() => {
      return deleteStudent.execute({
        studentId: 'fake student id',
      });
    }).rejects.toThrow(StudentNotFound);
  });
});
