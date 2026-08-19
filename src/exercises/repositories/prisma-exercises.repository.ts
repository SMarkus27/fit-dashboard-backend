import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';
import { ExercisesRepository } from './exercises.repository';
import {PrismaService} from "../../shared/database/prisma.service";

@Injectable()
export class PrismaExercisesRepository implements ExercisesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateExerciseDto): Promise<any> {
        return this.prisma.exercise.create({
            data,
        });
    }

    async findAll(): Promise<any> {
        return this.prisma.exercise.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<any>  {
        return this.prisma.exercise.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: UpdateExerciseDto): Promise<any>  {
        return this.prisma.exercise.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<any>  {
        await this.prisma.exercise.delete({
            where: { id },
        });
    }
}