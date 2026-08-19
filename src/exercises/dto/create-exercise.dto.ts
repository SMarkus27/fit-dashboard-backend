import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do exercício é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O groupo muscular alvo é obrigatório' })
  targetMuscleGroup: string;

  @IsString()
  @IsOptional()
  description?: string;
}
