import { Injectable } from '@nestjs/common';

import { University } from '@application/entities/curriculum/university';
import { UniversitiesRepository } from '@application/repositories/universities-repository';
import { AtributeAlreadyUsed } from '../errors/atribute-already-user';

interface CreateUniversityRequest {
  name: string;
  abv: string;
  city: string;
  state: string;
}

interface CreateUniversityResponse {
  university: University;
}

@Injectable()
export class CreateUniversity {
  constructor(private universitiesRepository: UniversitiesRepository) {}

  async execute(
    request: CreateUniversityRequest,
  ): Promise<CreateUniversityResponse> {
    const { name, abv, city, state } = request;

    const nameIsAlreadyUsed = await this.universitiesRepository.findByName(name)
    
    if(nameIsAlreadyUsed) {
      throw new AtributeAlreadyUsed('name')
    }

    const abvIsAlreadyUser = await this.universitiesRepository.findByAbv(abv)
    
    if(abvIsAlreadyUser) {
      throw new AtributeAlreadyUsed('abv')
    }

    const university = University.create({
      name,
      abv,
      city,
      state,
    });

    await this.universitiesRepository.create(university);

    return {
      university,
    };
  }
}
