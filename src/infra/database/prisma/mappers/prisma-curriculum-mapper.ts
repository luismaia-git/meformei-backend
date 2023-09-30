import { Curriculum } from '@application/entities/curriculum/curriculum';
import { University } from '@application/entities/curriculum/university';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import {
  Curriculum as RawCurriculumPrisma,
  University as UniversityPrisma,
} from '@prisma/client';

export class PrismaCurriculumMapper {
  static toPrisma(curriculum: Curriculum): RawCurriculumPrisma {
    const {
      courseName,
      description,
      id,
      extraCurricularHours,
      optionalHours,
      requiredHours,
      university,
    } = curriculum;
    return {
      id: id.toString(),
      courseName,
      description,
      extraCurricularHours,
      optionalHours,
      requiredHours,
      universityId: university.id.toString(),
    };
  }

  static toDomain(raw: RawCurriculum): Curriculum {
    const {
      courseName,
      description,
      extraCurricularHours,
      id,
      optionalHours,
      requiredHours,
      university,
    } = raw;

    return Curriculum.create(
      {
        courseName,
        description,
        // disciplines: MappingDiscipline(disciplines),
        extraCurricularHours,
        optionalHours,
        requiredHours,
        university: University.create(
          {
            name: university.name,
            abv: university.abv,
            city: university.city,
            state: university.state,
          },
          new UniqueEntityID(university.id),
        ),
      },
      new UniqueEntityID(id),
    );
  }
}

// function MappingDiscipline(disciplines: RawDisciplinesCurriculum) {
//   return disciplines.map((discipline) =>
//     Discipline.create({
//       cod: discipline.cod,
//       course: Course.create(
//         {
//           name: discipline.curriculum.course.name,
//         },
//         new UniqueEntityID(discipline.curriculum.course.id),
//       ),
//       courseOutline: discipline.courseOutline,
//       description: discipline.description,
//       name: discipline.name,
//       optional: discipline.optional,
//       university: University.create(
//         {
//           name: discipline.curriculum.university.name,
//           abv: discipline.curriculum.university.abv,
//         },
//         new UniqueEntityID(discipline.curriculum.university.id),
//       ),
//       prerequisiteDisciplines: discipline.prerequisitesDisciplines.map(
//         (discipline) => discipline.cod,
//       ),
//     }),
//   );
//   return;
// }

type RawCurriculum = RawCurriculumPrisma & {
  university: UniversityPrisma;
  // disciplines: RawDisciplinesCurriculum;
};

// type RawDisciplinesCurriculum = (DisciplinePrisma & {
//   prerequisitesDisciplines: DisciplinePrisma[];
//   curriculum: RawCurriculumPrisma & {
//     course: CoursePrisma;
//     university: UniversityPrisma;
//   };
// })[];

// type RawCurriculum2 = RawCurriculumPrisma & {
//   course: CoursePrisma;
//   university: UniversityPrisma;
//   disciplines: DisciplinePrisma & {
//     prerequisitesDisciplines: DisciplinePrisma & {
//       university: UniversityPrisma;
//       course: CoursePrisma;
//     }[];

//   }[];
// };
