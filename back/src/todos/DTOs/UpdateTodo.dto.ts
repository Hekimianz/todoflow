import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from '../Todo.entity';

export class UpdateTodoDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
