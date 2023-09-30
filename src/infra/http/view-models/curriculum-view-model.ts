import { Curriculum } from '@application/entities/curriculum/curriculum';
import { ApiProperty } from '@nestjs/swagger';
import { UniversityViewModel } from './university-view-model';

export class CurriculumViewModel {
  @ApiProperty()
  static toHTTP(curriculum: Curriculum) {
    const {
      courseName,
      description,
      extraCurricularHours,
      id,
      optionalHours,
      requiredHours,
      university,
    } = curriculum;

    return {
      id: id.toValue(),
      courseName,
      description,
      extraCurricularHours,
      optionalHours,
      requiredHours,
      university: UniversityViewModel.toHTTP(university),
    };
  }
}
