import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export type UserWithPassword = User & {
  passwordHash: string;
};

export abstract class UsersRepository {
  abstract create(data: CreateUserDto, passwordHash: string): Promise<User>;
  abstract findByEmail(email: string): Promise<UserWithPassword | null>;
  abstract findById(id: string): Promise<User | null>;
}
