import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './Todo.entity';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { CreateTodoDto } from './DTOs/CreateTodo.dto';
import { CurrentUser } from 'src/users/user.decorator';
import { UpdateTodoDTO } from './DTOs/UpdateTodo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllTodos(
    @CurrentUser() user: { id: string; username: string },
  ): Promise<Todo[]> {
    return await this.todosService.getAllTodos(user);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createTodo(
    @Body() dto: CreateTodoDto,
    @CurrentUser() user: { id: string; username: string },
  ): Promise<Todo> {
    return await this.todosService.createTodo(dto, user);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteTodo(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; username: string },
  ): Promise<{ message: 'ok' }> {
    return await this.todosService.deleteTodo(id, user);
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async updateTodo(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDTO,
    @CurrentUser() user: { id: string; username: string },
  ): Promise<Todo> {
    return await this.todosService.updateTodo(id, dto, user);
  }
}
