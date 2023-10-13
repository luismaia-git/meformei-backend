import { Injectable } from '@nestjs/common';

import { ExtraCurricular } from '@application/entities/extracurricular-activities/extracurricular-activities';
import { ExtraCurricularRepository } from '@application/repositories/extracurricular-repository';
import { UpdateExtraCurricularActivityBody } from '@infra/http/dto/extra-curricular-activity/update-extra-curricular-activity.dto';
import { ExtraCurricularActivityNotFound } from '../errors/extracurricular-activity-not-found';

interface Request {
  id: string;
  extraCurricularActivity: ExtraCurricular;
}
interface Response {
  extraCurricularActivity: UpdateExtraCurricularActivityBody; // a fazer
}

@Injectable()
export class UpdateExtraCurricularActivity {
  constructor(private extraCurricularRepository: ExtraCurricularRepository) {}

  async execute(request: Request): Promise<Response> {
    const { extraCurricularActivity : body, id } = request;

    const extraCurricularActivity =
      await this.extraCurricularRepository.findById(id);

    if (!extraCurricularActivity)
      throw new ExtraCurricularActivityNotFound();

    extraCurricularActivity.update(body)

    const extraCurricularActivityUpdated =
      await this.extraCurricularRepository.save(extraCurricularActivity);

    return {
      extraCurricularActivity: extraCurricularActivityUpdated,
    };
  }
}
