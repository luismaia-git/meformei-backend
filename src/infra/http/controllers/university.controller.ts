import { CreateCurriculum } from '@application/use-cases/curriculum/create-curriculum';
import { FindCurriculumsByUniversityId } from '@application/use-cases/curriculum/find-by-universityId';
import { CreateUniversity } from '@application/use-cases/university/create-university';
import { DeleteUniversity } from '@application/use-cases/university/delete-university';
import { FindUniversitiesByCity } from '@application/use-cases/university/find-universities-by-city';
import { FindUniversitiesByCityAndState } from '@application/use-cases/university/find-universities-by-city-and-state';
import { FindUniversitiesByState } from '@application/use-cases/university/find-universities-by-state';
import { FindUniversity } from '@application/use-cases/university/find-university';
import { ListUniversities } from '@application/use-cases/university/list-universities';
import { UpdateUniversity } from '@application/use-cases/university/update-university';
import { ROLES } from '@config/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCurriculumBody } from '../dto/curriculum/create-curriculum.dto';
import { ResponseWithMessage } from '../dto/response-message';
import { CreateUniversityBody } from '../dto/university/create-university.dto';
import { UpdateUniversityBody } from '../dto/university/update-university.dto';
import { CourseHttp } from '../types-class-http/course-http';
import { CurriculumHttp } from '../types-class-http/curriculum-http';
import { UniversityHttp } from '../types-class-http/university-http';
import { ToFront } from '../view-models/course-history-view-model';
import { CurriculumViewModel } from '../view-models/curriculum-view-model';
import { UniversityViewModel } from '../view-models/university-view-model';

abstract class IGetCurriculumsCoursesByUniversityIdResponse extends CourseHttp {
  @ApiProperty()
  curriculum: CurriculumHttp;
}

abstract class CreateCurriculumResponse extends ResponseWithMessage {
  @ApiProperty()
  curriculum: CurriculumHttp;
}

abstract class UniversityResponse extends ResponseWithMessage {
  @ApiProperty()
  university: UniversityHttp;
}

export abstract class DisciplineToFrontResponse {
  @ApiProperty({ isArray: true, type: ToFront })
  disciplines: ToFront[];
}

@Controller('universities')
@ApiTags('Universidades')
export class UniversitiesController {
  constructor(
    private createUniversity: CreateUniversity,
    private listUniversities: ListUniversities,
    private updateUniversity: UpdateUniversity,
    private deleteUniversity: DeleteUniversity,
    private findUniversity: FindUniversity,
    private findCurriculumsByUniversityId: FindCurriculumsByUniversityId,
    private findUniversitiesByState: FindUniversitiesByState,
    private findUniversitiesByCity: FindUniversitiesByCity,
    private createCurriculum: CreateCurriculum,
    private findUniversitiesByCityAndState: FindUniversitiesByCityAndState,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: UniversityHttp,
    isArray: true,
    description: 'Lista todos as universidades cadastradas no sistema',
  })
  async listAllUniversities() {
    const { universities } = await this.listUniversities.execute();

    return {
      universities: universities.map(UniversityViewModel.toHTTP),
    };
  }

  @Get('/state/:state/city/:city')
  @ApiResponse({
    type: UniversityHttp,
    isArray: true,
    description: 'Busca Universidades por Estado e Cidade',
  })
  async listAllUniversitiesByStateAndByCity(
    @Param('state') state: string,
    @Param('city') city: string,
  ) {
    const { universities } = await this.findUniversitiesByCityAndState.execute({
      state,
      city,
    });

    return {
      universities: universities.map(UniversityViewModel.toHTTP),
    };
  }

  @Get('/state/:state')
  @ApiResponse({
    type: UniversityHttp,
    isArray: true,
    description: 'Busca Universidades por Estado',
  })
  async listAllUniversitiesByState(@Param('state') state: string) {
    const { universities } = await this.findUniversitiesByState.execute({
      state,
    });

    return {
      universities: universities.map(UniversityViewModel.toHTTP),
    };
  }

  @Get('/city/:city')
  @ApiResponse({
    type: UniversityHttp,
    isArray: true,
    description: 'Busca Universidades por Cidade',
  })
  async listAllUniversitiesByCity(@Param('city') city: string) {
    const { universities } = await this.findUniversitiesByCity.execute({
      city,
    });

    return {
      universities: universities.map(UniversityViewModel.toHTTP),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: UniversityResponse,
    description: 'Busca Universidade pelo id',
  })
  async getUniversity(@Param('id') id: string) {
    const { university } = await this.findUniversity.execute({
      universityId: id,
    });
    return {
      message: 'Universidade encontrada!',
      university: UniversityViewModel.toHTTP(university),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: UniversityResponse,
    description: 'Registra uma Universidade',
  })
  async postUniversity(@Body() createUniversityBody: CreateUniversityBody) {
    const { university } = await this.createUniversity.execute(
      createUniversityBody,
    );

    return {
      message: 'Universidade criada!',
      university: UniversityViewModel.toHTTP(university),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id')
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: UniversityResponse,
    description: 'Atualiza uma Universidade',
  })
  async patchUniversity(
    @Body() updateUniversityBody: UpdateUniversityBody,
    @Param('id') id: string,
  ) {
    const { university } = await this.updateUniversity.execute({
      id,
      university: updateUniversityBody,
    });

    return {
      message: 'Universidade atualizada!',
      university: UniversityViewModel.toHTTP(university),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: UniversityResponse,
    description: 'Deleta uma Universidade',
  })
  async removeUniversity(@Param('id') id: string) {
    const { university } = await this.deleteUniversity.execute({
      universityId: id,
    });

    return {
      message: 'Universidade deletada!',
      university: UniversityViewModel.toHTTP(university),
    };
  }

  @Get(':id/courses')
  @ApiResponse({
    type: IGetCurriculumsCoursesByUniversityIdResponse,
    isArray: true,
    description: 'Busca as matrizes curriculares (Cursos) por universidade',
  })
  async getCurriculumsCoursesByUniversityId(@Param('id') id: string) {
    const { curriculums } = await this.findCurriculumsByUniversityId.execute({
      universityId: id,
    });
    if (curriculums.length === 0) {
      return { curriculums };
    }

    const curriculumsHttp = curriculums.map(CurriculumViewModel.toHTTP);

    // const courses = curriculumsHttp.map((curriculum) => {
    //   return {
    //     course: {
    //       ...curriculum.curriculumCourse,
    //       curriculum: curriculum,
    //     },
    //   };
    // });
    return {
      courses: curriculumsHttp,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/courses')
  @Roles(ROLES.ADMIN)
  @ApiResponse({
    type: CreateCurriculumResponse,
    description: 'Registra uma matriz curricular (Curso) na Universidade',
  })
  async registerCurriculumCourseInUniversity(
    @Body() createCurriculumBody: CreateCurriculumBody,
    @Param('id') universityId: string,
  ) {
    const { curriculum } = await this.createCurriculum.execute({
      ...createCurriculumBody,
      universityId,
    });

    return {
      message: 'Matriz curricular do curso cadastrada com sucesso!',

      curriculum: CurriculumViewModel.toHTTP(curriculum),
    };
  }
}
