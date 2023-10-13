import { Injectable } from '@nestjs/common';

import { Curriculum } from '@application/entities/curriculum/curriculum';
import { CurriculumsRepository } from '@application/repositories/curriculums-repository';
import { UpdateCurriculumBody } from '@infra/http/dto/curriculum/update-curriculum.dto';
import { CurriculumNotFound } from '../errors/curriculum-not-found';

interface UpdateCurriculumRequest {
  id: string;
  curriculum: UpdateCurriculumBody;
}
interface UpdateCurriculumResponse {
  curriculum: Curriculum;
}

@Injectable()
export class UpdateCurriculum {
  constructor(private curriculumsRepository: CurriculumsRepository) {}

  async execute(
    request: UpdateCurriculumRequest,
  ): Promise<UpdateCurriculumResponse> {
    const { curriculum: body, id } = request;
    const curriculum = await this.curriculumsRepository.findById(id);

    if (!curriculum) throw new CurriculumNotFound();

    curriculum.update(body);

    await this.curriculumsRepository.save(curriculum);

    return {
      curriculum,
    };
  }
}
