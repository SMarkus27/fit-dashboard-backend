import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  UsersRepository,
  UserWithPassword,
} from './repositories/users.repository';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashPassword(data.password);

    return this.usersRepository.create(data, passwordHash);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.usersRepository.findByEmail(email);
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const [salt, storedHash] = passwordHash.split(':');
    const hashedBuffer = (await scrypt(password, salt, 64)) as Buffer;
    const storedBuffer = Buffer.from(storedHash, 'hex');

    return (
      hashedBuffer.length === storedBuffer.length &&
      timingSafeEqual(hashedBuffer, storedBuffer)
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hashedBuffer = (await scrypt(password, salt, 64)) as Buffer;

    return `${salt}:${hashedBuffer.toString('hex')}`;
  }
}
