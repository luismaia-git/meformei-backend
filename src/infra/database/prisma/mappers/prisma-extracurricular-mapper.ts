import { ExtraCurricular } from '@application/entities/extracurricular-activities/extracurricular-activities';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ExtraCurricularActivitiesHistory as RawExtraCurricularPrisma } from '@prisma/client';

export class PrismaExtraCurricularMapper {
  static toPrisma(extraCurricular: ExtraCurricular) {
    return {
      id: extraCurricular.id.toString(),
      studentId: extraCurricular.studentId,
      extraCurricularName: extraCurricular.title,
      startDate: extraCurricular.startDate,
      endDate: extraCurricular.endDate,
      hours: extraCurricular.hours,
      situation: extraCurricular.situation,
      activityType: extraCurricular.activityType,
      participationType: extraCurricular.participationType,
      atUfc: extraCurricular.atUfc,
      institutionCnpj: extraCurricular.institutionCnpj,
      institutionCountry: extraCurricular.institutionCountry,
      institutionName: extraCurricular.institutionName,
    };
  }

  static toDomain(raw: RawExtraCurricular): ExtraCurricular {
    return ExtraCurricular.create(
      {
        title: raw.extraCurricularName,
        activityType: raw.activityType,
        atUfc: raw.atUfc,
        endDate: raw.endDate,
        hours: raw.hours,
        institutionName: raw.institutionName,
        situation: raw.situation,
        startDate: raw.startDate,
        studentId: raw.studentId,
        institutionCnpj: raw.institutionCnpj,
        institutionCountry: raw.institutionCountry,
        participationType: raw.participationType,
      },
      new UniqueEntityID(raw.id),
    );
  }
}

type RawExtraCurricular = RawExtraCurricularPrisma;
