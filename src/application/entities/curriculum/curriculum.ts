import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { University } from './university';

export interface CurriculumProps {
  courseName: string;
  description: string;
  university: University;
  requiredHours: number;
  optionalHours: number;
  extraCurricularHours: number;
}

export class Curriculum extends Entity<CurriculumProps> {
  static create(props: CurriculumProps, id?: UniqueEntityID) {
    const curriculum = new Curriculum(props, id);
    return curriculum;
  }

  public set courseName(course: string) {
    this.props.courseName = course;
  }

  public get courseName() {
    return this.props.courseName;
  }

  public set description(description: string) {
    this.props.description = description;
  }

  public get description() {
    return this.props.description;
  }

  public set university(university: University) {
    this.props.university = university;
  }

  public get university() {
    return this.props.university;
  }

  public set requiredHours(requiredHours: number) {
    this.props.requiredHours = requiredHours;
  }

  public get requiredHours() {
    return this.props.requiredHours;
  }

  public set optionalHours(optionalHours: number) {
    this.props.optionalHours = optionalHours;
  }

  public get optionalHours() {
    return this.props.optionalHours;
  }

  public set extraCurricularHours(extraCurricularHours: number) {
    this.props.extraCurricularHours = extraCurricularHours;
  }

  public get extraCurricularHours() {
    return this.props.extraCurricularHours;
  }

  public update(updateData: Partial<Curriculum>) {
   
    if (Object.keys(updateData).length === 0) {
      return; // Não há dados para atualizar
    }

    const { id, ...updatedProps } = updateData;

    Object.assign(this.props, updatedProps);
  }
}
