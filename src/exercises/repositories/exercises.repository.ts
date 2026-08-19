import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { Exercise } from '../entities/exercises.entity';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';

export abstract class ExercisesRepository {
  abstract create(data: CreateExerciseDto): Promise<Exercise>;
  abstract findAll(): Promise<Exercise[]>;
  abstract findOne(id: string): Promise<Exercise>;
  abstract update(id: string, data: UpdateExerciseDto): Promise<Exercise>;
  abstract delete(id: string): Promise<Exercise>;
}
