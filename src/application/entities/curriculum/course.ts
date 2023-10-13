import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface CourseProps {
  name: string;
  curriculums?: string[] | []; //muitos dados?
}

export class Course extends Entity<CourseProps> {
  static create(props: CourseProps, id?: UniqueEntityID) {
    const course = new Course(props, id);
    return course;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get name() {
    return this.props.name;
  }

  public get curriculums() {
    return this.props.curriculums;
  }

  public update(updateData: Partial<Course>) {
   
    if (Object.keys(updateData).length === 0) {
      return; // Não há dados para atualizar
    }

    const { id, ...updatedProps } = updateData;

    Object.assign(this.props, updatedProps);
  }
}
