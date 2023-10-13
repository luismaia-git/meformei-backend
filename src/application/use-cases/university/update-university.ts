import { Injectable } from '@nestjs/common';

import { University } from '@application/entities/curriculum/university';
import { UniversitiesRepository } from '@application/repositories/universities-repository';
import { UpdateUniversityBody } from '@infra/http/dto/university/update-university.dto';
import { UniversityNotFound } from '../errors/university-not-found';

interface UpdateUniversityRequest {
  id: string;
  university: UpdateUniversityBody;
}
interface UpdateUniversityResponse {
  university: University;
}

@Injectable()
export class UpdateUniversity {
  constructor(private universitiesRepository: UniversitiesRepository) {}

  async execute(
    request: UpdateUniversityRequest,
  ): Promise<UpdateUniversityResponse> {
    const { university : body, id } = request;

    const university = await this.universitiesRepository.findById(id);

    if (!university) throw new UniversityNotFound();
    
    university.update(body)

    const universityUpdated = await this.universitiesRepository.save(university);

    return {
      university: universityUpdated,
    };
  }
}
