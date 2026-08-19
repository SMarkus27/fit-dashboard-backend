import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Exercise } from './entities/exercises.entity';
import { ExercisesRepository } from './repositories/exercises.repository';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesRepository: ExercisesRepository) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return await this.exercisesRepository.create(createExerciseDto);
  }
  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne(id);
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
    return await this.findOne(id);
  }
  async findAll(): Promise<Exercise[]> {
    return await this.exercisesRepository.findAll();
  }
  async update(id: string, data: UpdateExerciseDto): Promise<Exercise> {
    await this.findOne(id);
    return await this.exercisesRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findOne(id);
    return await this.exercisesRepository.delete(id);
  }
}
