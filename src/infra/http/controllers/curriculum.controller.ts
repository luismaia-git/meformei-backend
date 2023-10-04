import { Discipline } from '@application/entities/discipline/discipline';
import { DeleteCurriculum } from '@application/use-cases/curriculum/delete-curriculum';
import { FindCurriculum } from '@application/use-cases/curriculum/find-curriculum';
import { UpdateCurriculum } from '@application/use-cases/curriculum/update-curriculum';
import { CreateDiscipline } from '@application/use-cases/discipline/create-discipline';
import { DeleteDiscipline } from '@application/use-cases/discipline/delete-discipline';
import { FindDiscipline } from '@application/use-cases/discipline/find-discipline';
import { FindDisciplineByCodArray } from '@application/use-cases/discipline/find-disciplines-by-cod-array';
import { FindDisciplinesByCurriculum } from '@application/use-cases/discipline/find-disciplines-by-curriculum';
import { UpdateDiscipline } from '@application/use-cases/discipline/update-discipline';
import { ROLES } from '@config/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateCurriculumBody } from '../dto/curriculum/update-curriculum.dto';
import { CreateManyDisciplineBody } from '../dto/discipline/create-discipline.dto';
import { FindDisciplineByCodsBody } from '../dto/discipline/find-discipline-by-cods.dto';
import { UpdateDisciplineBody } from '../dto/discipline/update-discipline.dto';
import { ResponseWithMessage } from '../dto/response-message';
import { CurriculumHttp } from '../types-class-http/curriculum-http';
import { DisciplineHttp } from '../types-class-http/discipline-http';
import { ToFront } from '../view-models/course-history-view-model';
import { CurriculumViewModel } from '../view-models/curriculum-view-model';
import { DisciplineViewModel } from '../view-models/discipline-view-model';

abstract class CurriculumResponse extends ResponseWithMessage {
  @ApiProperty()
  curriculum: CurriculumHttp;
}

abstract class DisciplineResponse extends ResponseWithMessage {
  @ApiProperty()
  discipline: DisciplineHttp;
}


export abstract class DisciplineToFrontResponse {
  @ApiProperty({ isArray: true, type: ToFront })
  disciplines: ToFront[];
}

@Controller('curriculums')
@ApiTags('Matriz curricular / cursos')
export class CurriculumController {
  constructor(
    private createDiscipline: CreateDiscipline,
    private findDiscipline: FindDiscipline,
    private findDisciplineByCodArray: FindDisciplineByCodArray,
    private findDisciplineByCurriculum: FindDisciplinesByCurriculum,
    private findCurriculumById: FindCurriculum,
    private updateCurriculum: UpdateCurriculum,
    private deleteCurriculum: DeleteCurriculum,
    private deleteDiscipline: DeleteDiscipline,
    private updateDisciplineById: UpdateDiscipline
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':curriculumId')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  async getCurriculumCourseByCurriculumId(
    @Param('curriculumId') curriculumId: string,
  ) {
    const { curriculum } =
      await this.findCurriculumById.execute({
        curriculumId,
      });

    return {
      course: CurriculumViewModel.toHTTP(curriculum),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':curriculumId')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  async updateCurriculumCourseByCurriculumId(
    @Param('curriculumId') curriculumId: string,
    @Body() updateBody: UpdateCurriculumBody, 
  ) {
    const { curriculum } =
      await this.updateCurriculum.execute({
        id: curriculumId, curriculum: updateBody,
      });

    return {
      course: CurriculumViewModel.toHTTP(curriculum),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: CurriculumResponse,
    description: 'Deleta uma Matriz Curricular',
  })
  async removeUniversity(@Param('id') id: string) {
    const { curriculum } = await this.deleteCurriculum.execute({
      curriculumId: id,
    });

    return {
      message: 'Matriz curricular deletada!',
      university: CurriculumViewModel.toHTTP(curriculum),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post(':curriculumId/disciplines')
  @Roles(ROLES.ADMIN)
  async associateDisciplineInCurriculum(
    @Param('curriculumId') curriculumId: string,
    @Body() disciplineBody: CreateManyDisciplineBody,
  ) {
    const disciplines: Discipline[] = [];
    const codErrors: string[] = [];
    let message = '';
    for (const discipline of disciplineBody.disciplines) {
      const {
        discipline: disciplineUseCase,
        error,
        cod,
      } = await this.createDiscipline.execute({
        ...discipline,
        curriculumId,
      });

      if (!error) {
        disciplines.push(disciplineUseCase);
      }
      if (cod) {
        codErrors.push(cod);
      }
    }

    if (codErrors.length > 0) {
      message = 'Codigos de disciplinas que houve erro ao cadastra-la:';
    }

    return {
      disciplines: DisciplineViewModel.toFront(disciplines),
      message,
      codErrors: codErrors,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':curriculumId/disciplines/to-student')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  @ApiResponse({
    type: DisciplineToFrontResponse,
    description: 'Busca as disciplinas de uma matriz curricular',
  })
  async findDisciplinesToStudentByCurriculum(
    @Param('curriculumId') curriculumId: string,
  ) {
    const { disciplines } = await this.findDisciplineByCurriculum.execute({
      curriculumId,
    });
    return {
      disciplines: DisciplineViewModel.toFront(disciplines),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':curriculumId/disciplines')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  @ApiResponse({
    type: DisciplineToFrontResponse,
    description: 'Busca as disciplinas de uma matriz curricular',
  })
  async findDisciplinesByCurriculum(
    @Param('curriculumId') curriculumId: string,
  ) {
    const { disciplines } = await this.findDisciplineByCurriculum.execute({
      curriculumId,
    });
    return {
      disciplines: disciplines.map(DisciplineViewModel.toHTTP) ,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':curriculumId/disciplines/cod')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  @ApiResponse({
    type: DisciplineToFrontResponse,
    description: 'Busca as disciplinas por codigo',
  })
  async findDisciplinesByCods(@Body() body: FindDisciplineByCodsBody) {
    const { disciplines } = await this.findDisciplineByCodArray.execute({
      cods: body.cods,
    });
    return {
      disciplines: disciplines.map(DisciplineViewModel.toHTTP),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':curriculumId/disciplines/required')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  @ApiResponse({
    type: DisciplineToFrontResponse,
    description: 'Busca as disciplinas de uma matriz curricular',
  })
  async findDisciplinesRequiredByCurriculum(
    @Param('curriculumId') curriculumId: string,
  ) {
    const { disciplines } = await this.findDisciplineByCurriculum.execute({
      curriculumId,
    });
    return {
      disciplines: DisciplineViewModel.toFront(
        disciplines.filter((discipline) => discipline.optional === false),
      ),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':curriculumId/disciplines/:disciplineId')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  async findDisciplineById(@Param('disciplineId') disciplineId: string) {
    const { discipline } = await this.findDiscipline.execute({
      disciplineId,
    });
    return {
      discipline: DisciplineViewModel.toHTTP(discipline),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch('disciplines/:disciplineId')
  @Roles(ROLES.ADMIN, ROLES.STUDENT)
  async updatesDisciplineById(@Param('disciplineId') disciplineId: string,
  @Body() updateBody: UpdateDisciplineBody,) {
    const { discipline } = await this.updateDisciplineById.execute({
      id: disciplineId, discipline: updateBody
    });
    return {
      discipline: DisciplineViewModel.toHTTP(discipline),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('disciplines/:disciplineId')
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: DisciplineResponse,
    description: 'Deleta uma Disciplina de uma matriz curricular',
  })
  async deleteDisciplineById(@Param('disciplineId') id: string) {
    const { discipline } = await this.deleteDiscipline.execute({
      disciplineId: id,
    });

    return {
      message: 'Matriz curricular deletada!',
      university: DisciplineViewModel.toHTTP(discipline),
    };
  }
}
