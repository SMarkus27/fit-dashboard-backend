import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersRepository, UserWithPassword } from './users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto, passwordHash: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
      },
      select: this.publicUserSelect(),
    });
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        ...this.publicUserSelect(),
        passwordHash: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.publicUserSelect(),
    });
  }

  private publicUserSelect() {
    return {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
