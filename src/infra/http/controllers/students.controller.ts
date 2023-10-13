import {
  CourseHistory,
  StatusTypeClass
} from '@application/entities/course-history/course-history';
import { AssociateDisciplineInStudentSemester } from '@application/use-cases/course-history/associate-discipline-in-student-semester';
import { DisassociateDisciplineInStudentSemester } from '@application/use-cases/course-history/disassociate-discipline-in-student-semester';
import { FindCourseHistoryByStatusAndStudentRegistration } from '@application/use-cases/course-history/find-course-history-by-status';
import { FindCourseHistoryByStudentRegistrationBySemesterByDisciplineId } from '@application/use-cases/course-history/find-course-history-by-student-registration-semester-discipline-id';
import { FindDisciplinesHistoryByStudentRegistration } from '@application/use-cases/course-history/find-disciplines-history-by-student-registration';
import { FindDisciplinesHistoryByStudentRegistrationBySemester } from '@application/use-cases/course-history/find-disciplines-history-by-student-registration-semester';
import { ListDisciplinesHistoryTodo } from '@application/use-cases/course-history/list-disciplines-history-to-do';
import { UpdateCourseHistory } from '@application/use-cases/course-history/update-course-history';
import { CreateExtraCurricularActivity } from '@application/use-cases/extracurricular-activities/create-extracurricular-activity';
import { DeleteExtraCurricular } from '@application/use-cases/extracurricular-activities/delete-extracurricular-activity';
import { FindExtraCurricularActivityByStudent } from '@application/use-cases/extracurricular-activities/find-extracurricular-activity-by-student';
import { CreateStudent } from '@application/use-cases/student/create-student';
import { DeleteStudent } from '@application/use-cases/student/delete-student';
import { FindStudent } from '@application/use-cases/student/find-student';
import { ListStudents } from '@application/use-cases/student/list-students';
import { UpdateStudent } from '@application/use-cases/student/update-student';
import { ROLES } from '@config/constants';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AssociateDisciplineInStudentSemesterBody } from '../dto/course-history/associate-discipline-in-student-semester.dto';
import { FindDisciplinesTodoBody } from '../dto/course-history/findDisciplinesTodo.dto';
import { UpdateDisciplineInStudentSemester } from '../dto/course-history/update-discipline-in-student-semester.dto';
import { CreateExtraCurricularActivityBody } from '../dto/extra-curricular-activity/create-extra-curricular-activity.dto';
import { ResponseWithMessage } from '../dto/response-message';
import { CreateStudentBody } from '../dto/student/create-student.dto';
import { UpdateStudentBody } from '../dto/student/update-student.dto';
import { CourseHistoryHttp } from '../types-class-http/course-history-http';
import { ExtraCurricularActivityHttp } from '../types-class-http/extra-curricular-activity-http';
import { StudentHttp } from '../types-class-http/student-http';
import {
  CourseHistoryViewModel,
  ToFront,
} from '../view-models/course-history-view-model';
import { DisciplineViewModel } from '../view-models/discipline-view-model';
import { ExtraCurricularActivityViewModel } from '../view-models/extra-curricular-activity-view-model';
import { StudentViewModel } from '../view-models/student-view-model';

export class StudentResponse {
  @ApiProperty()
  student: StudentHttp;
}

export class StudentResponseWithMessage extends ResponseWithMessage {
  @ApiProperty()
  student: StudentHttp;
}

export class CourseHistoryResponse {
  @ApiProperty()
  disciplineHistory: CourseHistoryHttp;
}

export class CourseHistoryToFrontResponse {
  @ApiProperty({ isArray: true, type: ToFront })
  disciplineHistory: ToFront[];
}

export class ExtraCurricularActivityResponse extends ResponseWithMessage {
  @ApiProperty({ isArray: true, type: ExtraCurricularActivityHttp })
  extraCurricularActivities: ExtraCurricularActivityHttp[];
}

@Controller('students')
@ApiTags('Estudantes')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsController {
  constructor(
    private createStudent: CreateStudent,
    private listStudents: ListStudents,
    private findStudent: FindStudent,
    private deleteStudent: DeleteStudent,
    private updateStudent: UpdateStudent,
    private associateDisciplineInStudentSemester: AssociateDisciplineInStudentSemester,
    private disassociateDisciplineInStudentSemester: DisassociateDisciplineInStudentSemester,
    private findCourseHistoryByStudentRegistrationBySemesterByDisciplineId: FindCourseHistoryByStudentRegistrationBySemesterByDisciplineId,
    private findDisciplinesHistoryByStudentRegistrationBySemester: FindDisciplinesHistoryByStudentRegistrationBySemester,
    private findDisciplinesHistoryByStudentRegistration: FindDisciplinesHistoryByStudentRegistration,
    private findCourseHistoryByStatusAndStudentRegistration: FindCourseHistoryByStatusAndStudentRegistration,
    private createExtracurricularActivity: CreateExtraCurricularActivity,
    private deleteExtraCurricular: DeleteExtraCurricular,
    private findExtraCurricularActivityByStudent: FindExtraCurricularActivityByStudent,
    private listDisciplinesHistoryTodo: ListDisciplinesHistoryTodo,
    private updateCourseHistory : UpdateCourseHistory
  ) {}

  @Get()
  @Roles(ROLES.ADMIN)
  @ApiResponse({ type: StudentResponse, isArray: true, description: "Lista os estudantes cadastrados no sistema" })
  async listAllStudents() {
    const { students } = await this.listStudents.execute();

    return {
      students: students.map(StudentViewModel.toHTTP),
    };
  }

  @Get(':id')
  @ApiResponse({ type: StudentResponseWithMessage, description: "Procura por um estudante" })
  async getStudent(@Param('id') id: string) {
    const { student } = await this.findStudent.execute({ studentId: id });

    return {
      message: 'Estudante encontrado!',
      student: StudentViewModel.toHTTP(student),
    };
  }

  @Post()
  @Roles(ROLES.ADMIN)
  @ApiResponse({ type: StudentResponseWithMessage, description: "Cria um estudante (ADMIN)" })
  async postStudent(@Body() createStudentBody: CreateStudentBody) {
    const { student } = await this.createStudent.execute(createStudentBody);

    return {
      message: 'Estudante criado!',

      student: StudentViewModel.toHTTP(student),
    };
  }

  @Patch(':id')
  @Roles(ROLES.STUDENT)
  @ApiResponse({ type: StudentResponse && ResponseWithMessage, description: "Atualiza dados do Estudante" })
  async patchStudent(
    @Body() updateStudentBody: UpdateStudentBody,
    @Param('id') id: string,
  ) {
    const { student } = await this.updateStudent.execute({
      id,
      student: updateStudentBody,
    });

    return {
      message: 'Estudante atualizado!',

      student: StudentViewModel.toHTTP(student),
    };
  }

  //semester

  @Post(':studentRegistration/semester/:semester')
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  @ApiResponse({type: CourseHistoryToFrontResponse,  description: "Associa disciplina(s) no historico do estudante"})
  async addDisciplineInSemester(
    @Body() request: AssociateDisciplineInStudentSemesterBody,
    @Param('studentRegistration') studentRegistration: string,
    @Param('semester') semester: number,
  ) {
    const { disciplines } = request;
    const courseHistories: CourseHistory[] = [];

    for (const discipline of disciplines) {
      const { courseHistory } =
        await this.associateDisciplineInStudentSemester.execute({
          ...discipline,
          semester: semester,
          studentRegistration: studentRegistration,
        });
      courseHistories.push(courseHistory);
    }

    return {
      message: 'Disciplina(s) associada(s) com sucesso!',
      disciplineHistory: CourseHistoryViewModel.toFront(courseHistories),
    };
  }

  @Delete(':studentRegistration/semester/:semester/disciplines/:disciplineId')
  @ApiResponse({type: ToFront, isArray: true , description: "Dessasocia disciplina no historico do estudante"})
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  async disassociateDisciplineInSemester(
    @Param('studentRegistration') studentRegistration: string,
    @Param('semester') semester: number,
    @Param('disciplineId') disciplineId: string,
  ) {
    const { courseHistory } =
      await this.findCourseHistoryByStudentRegistrationBySemesterByDisciplineId.execute(
        { disciplineId, semester, studentRegistration },
      );
    const { courseHistory: courseHistoryDeleted } =
      await this.disassociateDisciplineInStudentSemester.execute({
        courseHistoryId: courseHistory.id.toString(),
      });

    return {
      message: 'Disciplina dessasociada com sucesso!',
      discipline: CourseHistoryViewModel.toHTTP(courseHistoryDeleted),
    };
  }

  @Get(':studentRegistration/semester/:semester/disciplines')
  @ApiResponse({type: ToFront, isArray: true , description: "Procura por disciplinas no historico do estudante pelo semestre"})
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  async findDisciplinesBySemester(
    @Param('studentRegistration') studentRegistration: string,
    @Param('semester') semester: number,
  ) {
    const { courseHistories } =
      await this.findDisciplinesHistoryByStudentRegistrationBySemester.execute({
        semester,
        studentRegistration,
      });

    return {
      disciplineHistory: CourseHistoryViewModel.toFront(courseHistories),
    };
  }

  @Get(':studentRegistration/disciplines')
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  @ApiResponse({type: ToFront, isArray:true,  description: "Procura por disciplina(s) no historico do estudante pelo Id do estudante"})
  async findDisciplinesByStudent(
    @Param('studentRegistration') studentRegistration: string,
  ) {
    const { courseHistories } =
      await this.findDisciplinesHistoryByStudentRegistration.execute({
        studentRegistration,
      });

    return {
      disciplineHistory: CourseHistoryViewModel.toFront(courseHistories),
    };
  }

  @Get(':studentRegistration/disciplines/todo')
  @ApiResponse({type: ToFront, isArray: true , description: "Procura por disciplinas no historico do estudante que ele ainda precisa fazer."})
  async findDisciplinesTodoByStudent(
    @Param('studentRegistration') studentRegistration: string,
    @Body() body: FindDisciplinesTodoBody,
  ) {
    const { disciplinesTodo } = await this.listDisciplinesHistoryTodo.execute({
      studentRegistration,
      curriculumId: body.curriculumId,
    });

    return {
      disciplines: DisciplineViewModel.toFront(disciplinesTodo),
    };
  }

  @Get(':studentRegistration/disciplines/status/:status')
  @ApiResponse({type: ToFront, isArray: true , description: "Procura por disciplinas no historico do estudante pelo status"})
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  async findDisciplinesByStatusAndStudent(
    @Param('studentRegistration') studentRegistration: string,
    @Param() statusType: StatusTypeClass,
  ) {
    if (
      statusType.status !== 'DONE' &&
      statusType.status !== 'INPROGRESS' &&
      statusType.status !== 'FAILED' &&
      statusType.status !== 'WITHDRAWAL'
    ) {
      throw new ForbiddenException(
        "Status must be 'DONE' or 'INPROGRESS ' or 'WITHDRAWAL or FAILED'",
      );
    }
    const { courseHistory } =
      await this.findCourseHistoryByStatusAndStudentRegistration.execute({
        studentRegistration,
        status: statusType.status,
      });

    return {
      disciplineHistory: CourseHistoryViewModel.toFront(courseHistory),
    };
  }

  @Patch('courseHistory/:courseHistoryId')
  @ApiResponse({type: ToFront, isArray: true , description: "Atualiza dados de uma associação de uma disciplina"})
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  async updateDisciplinesByStatusAndStudent(
    @Param('courseHistoryId') courseHistoryId: string,
    @Body() request : UpdateDisciplineInStudentSemester,
  ) {

   const {courseHistory} = await this.updateCourseHistory.execute({id: courseHistoryId, courseHistory: request})
    
   
    return {
      disciplineHistory: CourseHistoryViewModel.toHTTP(courseHistory),
    };
  }

  //extracurricularactivity

  @Post(':studentRegistration/extracurricular')
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  @ApiResponse({ type: ExtraCurricularActivityResponse, description: "Registra uma atividade extra curricular de um estudante" })
  async addExtracurricularActivity(
    @Body() body: CreateExtraCurricularActivityBody,
    @Param('studentRegistration') studentRegistration: string,
  ) {
    const { extraCurricularActivity } =
      await this.createExtracurricularActivity.execute({
        ...body,
        studentRegistration,
      });

    return {
      message: 'Atividade extra curricular criada com sucesso!',
      extraCurricular: ExtraCurricularActivityViewModel.toHTTP(
        extraCurricularActivity,
      ),
    };
  }

  @Delete(':studentRegistration/extracurricular/:extracurricularId')
  @ApiResponse({type: ResponseWithMessage && ExtraCurricularActivityHttp, description: "Deleta uma atividade extra curricular de estudante"})
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  async removeExtracurricularActivity(
    @Param('extracurricularId') extracurricularId: string,
  ) {
    const { extraCurricular } = await this.deleteExtraCurricular.execute({
      id: extracurricularId,
    });

    return {
      message: 'Atividade extra curricular deletada com sucesso!',
      extraCurricular: ExtraCurricularActivityViewModel.toHTTP(extraCurricular),
    };
  }

  @Get(':studentRegistration/extracurricular')
  @ApiResponse({type: ExtraCurricularActivityHttp, isArray: true, description: "Procura as atividades extra curriculares de estudante"})
  @Roles(ROLES.STUDENT, ROLES.ADMIN)
  async findExtracurricularActivitiesBySemester(
    @Param('studentRegistration') studentRegistration: string,
  ) {
    const { extraCurricularActivities } =
      await this.findExtraCurricularActivityByStudent.execute({
        studentRegistration,
      });

    return {
      extraCurricularActivities: extraCurricularActivities.map(
        ExtraCurricularActivityViewModel.toHTTP,
      ),
    };
  }
}
