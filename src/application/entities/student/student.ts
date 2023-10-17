import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Optional } from '@core/types/optional';
import { University } from '../curriculum/university';
import { UserProps } from '../user/user';

export interface StudentProps extends UserProps {
  registration: string;
  curriculumId: string;
  studentId?: UniqueEntityID;
  enrollmentYear: number;
  enrollmentSemester: number;
  currentSemester?: number;
  courseName: string;
  university: University;
}

export class Student extends Entity<StudentProps> {
  static create(
    props: Optional<StudentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const student = new Student(
      {
        ...props,
        studentId: props.studentId ?? new UniqueEntityID(),
        createdAt: props.createdAt ?? new Date(),
        currentSemester: CurrentSemesterCalculator(
          props.enrollmentYear,
          props.enrollmentSemester,
        ),
          
      },
      id,
    );
    return student;
  }

  // public get _props() {
  //   return this.props;
  // }

  public set name(name: string) {
    this.props.name = name;
  }

  public get name() {
    return this.props.name;
  }

  public set city(city: string) {
    this.props.city = city;
  }

  public get city() {
    return this.props.city;
  }

  public set lastname(lastname: string) {
    this.props.lastname = lastname;
  }

  public get lastname() {
    return this.props.lastname;
  }

  public set username(username: string) {
    this.props.username = username;
  }

  public get username() {
    return this.props.username;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get email() {
    return this.props.email;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get password() {
    return this.props.password;
  }

  public set state(state: string) {
    this.props.state = state;
  }

  public get state() {
    return this.props.state;
  }

  public set recoverToken(recoverToken: string) {
    this.props.recoverToken = recoverToken;
  }

  public get recoverToken() {
    return this.props.recoverToken;
  }
  public set salt(salt: string) {
    this.props.salt = salt;
  }

  public get salt() {
    return this.props.salt;
  }
  public set inative(inative: Date) {
    this.props.inative = inative;
  }

  public get inative() {
    return this.props.inative;
  }
  public set avatar(avatar: string) {
    this.props.avatar = avatar;
  }

  public get avatar() {
    return this.props.avatar;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public set registration(registration: string) {
    this.props.registration = registration;
  }

  public get registration() {
    return this.props.registration;
  }

  public set curriculumId(curriculumId: string) {
    this.props.curriculumId = curriculumId;
  }

  public get curriculumId() {
    return this.props.curriculumId;
  }

  public set studentId(studentId: UniqueEntityID) {
    this.props.studentId = studentId;
  }

  public get studentId() {
    return this.props.studentId;
  }

  public set enrollmentYear(enrollmentYear: number) {
    this.props.enrollmentYear = enrollmentYear;
  }

  public get enrollmentYear() {
    return this.props.enrollmentYear;
  }

  public set enrollmentSemester(enrollmentSemester: number) {
    this.props.enrollmentSemester = enrollmentSemester;
  }

  public get enrollmentSemester() {
    return this.props.enrollmentSemester;
  }

  public set currentSemester(currentSemester: number) {
    this.props.currentSemester = currentSemester;
  }

  public get currentSemester() {
    return this.props.currentSemester;
  }

  public set courseName(course: string) {
    this.props.courseName = course;
  }

  public get courseName() {
    return this.props.courseName;
  }

  public set university(university: University) {
    this.props.university = university;
  }

  public get university() {
    return this.props.university;
  }

  public update(updateData: Partial<Student>) {
    if (Object.keys(updateData).length === 0) {
      return; // Não há dados para atualizar
    }

    const { id, createdAt, ...updatedProps } = updateData;

    Object.assign(this.props, updatedProps);
  }
}

function CurrentSemesterCalculator(
  anoDeEntrada: number,
  semestreDeEntrada: number,
): number {
  const now = new Date();
  const anoAtual = now.getFullYear();
  const mesAtual = now.getMonth() + 1;

  let semestreAtual: number;
  if (mesAtual >= 1 && mesAtual <= 6) {
    semestreAtual = 1;
  } else {
    semestreAtual = 2;
  }

  const diferencaAnos = anoAtual - anoDeEntrada;
  let semestresCompletos = diferencaAnos * 2;

  if (semestreDeEntrada === 1) {
    semestresCompletos += semestreAtual - 1;
  } else if (semestreDeEntrada === 2) {
    semestresCompletos += semestreAtual;
  }

  return semestresCompletos + 1;
}
