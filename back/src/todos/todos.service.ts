import { Injectable } from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { Todo } from './Todo.entity';
import { CreateTodoDto } from './DTOs/CreateTodo.dto';
import { UpdateTodoDTO } from './DTOs/UpdateTodo.dto';

@Injectable()
export class TodosService {
  constructor(private todosRepo: TodosRepository) {}
  async getAllTodos(user: { id: string; username: string }): Promise<Todo[]> {
    return await this.todosRepo.getAllTodos(user);
  }

  async createTodo(
    dto: CreateTodoDto,
    user: { id: string; username: string },
  ): Promise<Todo> {
    return await this.todosRepo.createTodo(dto, user);
  }

  async deleteTodo(
    id: string,
    user: { id: string; username: string },
  ): Promise<{ message: 'ok' }> {
    return await this.todosRepo.deleteTodo(id, user);
  }

  async updateTodo(
    id: string,
    dto: UpdateTodoDTO,
    user: { id: string; username: string },
  ): Promise<Todo> {
    return await this.todosRepo.updateTodo(id, dto, user);
  }
}
