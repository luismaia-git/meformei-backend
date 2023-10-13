import { Entity } from '@core/entities/entity';
import { Optional } from '@core/types/optional';
import { IsEnum } from 'class-validator';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Discipline } from '../discipline/discipline';

export type StatusType = 'DONE' | 'INPROGRESS' | 'FAILED' | 'WITHDRAWAL';
enum StatusTypeEnum {
  'DONE',
  'INPROGRESS',
  'FAILED',
  'WITHDRAWAL',
}
export abstract class StatusTypeClass {
  @IsEnum(StatusTypeEnum)
  status: string;
}
export interface CourseHistoryProps {
  studentId: string;
  discipline: Discipline;
  status: StatusType;
  createdAt: Date;
  semester: number;
  startTime: string;
  endTime: string;
  hours: number;
  daysWeek: string[];
}

export class CourseHistory extends Entity<CourseHistoryProps> {
  static create(
    props: Optional<CourseHistoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const courseHistory = new CourseHistory(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return courseHistory;
  }

  public set studentId(studentId: string) {
    this.props.studentId = studentId;
  }

  public get studentId() {
    return this.props.studentId;
  }

  public set discipline(discipline: Discipline) {
    this.props.discipline = discipline;
  }

  public get discipline() {
    return this.props.discipline;
  }

  public set status(status: StatusType) {
    this.props.status = status;
  }

  public get status() {
    return this.props.status;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public set semester(semester: number) {
    this.props.semester = semester;
  }

  public get semester() {
    return this.props.semester;
  }

  public set startTime(startTime: string) {
    this.props.startTime = startTime;
  }

  public get startTime() {
    return this.props.startTime;
  }

  public set endTime(endTime: string) {
    this.props.endTime = endTime;
  }

  public get endTime() {
    return this.props.endTime;
  }

  public set hours(hours: number) {
    this.props.hours = hours;
  }

  public get hours() {
    return this.props.hours;
  }

  public set daysWeek(daysWeek: string[]) {
    this.props.daysWeek = daysWeek;
  }

  public get daysWeek() {
    return this.props.daysWeek;
  }

  public update(updateData: Partial<CourseHistory>) {
    if (Object.keys(updateData).length === 0) {
      return; // Não há dados para atualizar
    }

    const { id, createdAt, ...updatedProps } = updateData;

    Object.assign(this.props, updatedProps);
  }
}
