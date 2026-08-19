import { Module } from '@nestjs/common';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { ExercisesRepository } from './repositories/exercises.repository';
import { PrismaExercisesRepository } from './repositories/prisma-exercises.repository';

@Module({
  controllers: [ExercisesController],
  providers: [
    ExercisesService,
    {
      provide: ExercisesRepository,
      useClass: PrismaExercisesRepository,
    },
  ],
  exports: [ExercisesService],
})
export class ExerciseModule {}
