import { User } from 'src/application/entities/user/user';
import { UsersRepository } from 'src/application/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((item) => item.email.toString() === email);

    if (!user) {
      return null;
    }

    return user;
  }
  
  async findByRecoverToken(recoverToken: string): Promise<User> {
    const user = this.users.find((item) => item.recoverToken.toString() === recoverToken);

    if (!user) {
      return null;
    }

    return user;
  }
  public users: User[] = [];

  async findById(userId: string): Promise<User| null> {
    const user = this.users.find((item) => item.id.toString() === userId);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User) {
    this.users.push(user);
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex((item) => item.id === user.id);

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }
  }

  async list(): Promise<User[] | []> {
    return this.users;
  }

  async delete(userId: string): Promise<void> {
    const usersIndex = this.users.findIndex(
      (item) => item.id.toString() === userId,
    );

    if (usersIndex >= 0) {
      this.users.splice(usersIndex, 1);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const student = this.users.find((item) => item.username == username);
    if (!student) {
      return null;
    }

    return student;
  }
}
