import { Module } from '@nestjs/common';
import {ExercisesController} from "./exercises/exercises.controller";
import {ExercisesService} from "./exercises/exercises.service";
import {DatabaseModule} from "./shared/database/database.module";
import {ExerciseModule} from "./exercises/exercises.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      DatabaseModule,
      ExerciseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
