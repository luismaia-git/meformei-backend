import { Injectable } from '@nestjs/common';

import { Discipline } from '@application/entities/discipline/discipline';
import { DisciplinesRepository } from '@application/repositories/disciplines-repository';
import { UpdateDisciplineBody } from '@infra/http/dto/discipline/update-discipline.dto';
import { DisciplineNotFound } from '../errors/discipline-not-found';

interface UpdateDisciplineRequest {
  id: string;
  discipline: UpdateDisciplineBody;
}
interface UpdateDisciplineResponse {
  discipline: Discipline;
}

@Injectable()
export class UpdateDiscipline {
  constructor(private disciplinesRepository: DisciplinesRepository) {}

  async execute(
    request: UpdateDisciplineRequest,
  ): Promise<UpdateDisciplineResponse> {
    const { discipline: body, id } = request;

    const discipline = await this.disciplinesRepository.findById(id);

    if (!discipline) throw new DisciplineNotFound();

    discipline.update(body);

    await this.disciplinesRepository.save(discipline);

    return {
      discipline,
    };
  }
}
