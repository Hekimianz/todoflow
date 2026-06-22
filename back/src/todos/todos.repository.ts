import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './Todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './DTOs/CreateTodo.dto';
import { UpdateTodoDTO } from './DTOs/UpdateTodo.dto';

@Injectable()
export class TodosRepository {
  constructor(@InjectRepository(Todo) private todosRepo: Repository<Todo>) {}
  async getAllTodos(user: { id: string; username: string }): Promise<Todo[]> {
    return await this.todosRepo.find({ where: { user: { id: user.id } } });
  }
  async createTodo(
    dto: CreateTodoDto,
    user: { id: string; username: string },
  ): Promise<Todo> {
    const newTask = this.todosRepo.create({
      ...dto,
      user: user,
    });
    return await this.todosRepo.save(newTask);
  }

  async deleteTodo(
    id: string,
    user: { id: string; username: string },
  ): Promise<{ message: 'ok' }> {
    const task = await this.todosRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('No task found');
    if (task.user.id !== user.id)
      throw new UnauthorizedException("Couldn't delete task");
    await this.todosRepo.delete(id);
    return { message: 'ok' };
  }

  async updateTodo(
    id: string,
    dto: UpdateTodoDTO,
    user: { id: string; username: string },
  ): Promise<Todo> {
    const task = await this.todosRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('No task found with given id');
    if (task.user.id !== user.id)
      throw new UnauthorizedException("Couldn't update task");
    Object.assign(task, dto);
    return await this.todosRepo.save(task);
  }
}
