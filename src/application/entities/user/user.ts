import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Optional } from '@core/types/optional';

export interface UserProps {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  state: string;
  city: string;
  recoverToken?: string;
  salt?: string;
  inative: Date
  avatar: string
  createdAt?: Date
}

export class User extends Entity<UserProps> {
  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User({...props, createdAt: props.createdAt ?? new Date()}, id);
    return user;
  }

  public get _props() {
    return this.props;
  }

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

}
