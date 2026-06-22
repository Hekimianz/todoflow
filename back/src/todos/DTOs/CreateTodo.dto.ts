import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Priority } from '../Todo.entity';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
