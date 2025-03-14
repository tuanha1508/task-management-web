import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      creatorId: userId,
    });
    
    const savedTask = await this.tasksRepository.save(task);
    
    // Notify all clients about the new task
    this.eventsGateway.notifyNewTask(savedTask);
    
    return savedTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    // Update task properties
    Object.assign(task, updateTaskDto);
    
    const updatedTask = await this.tasksRepository.save(task);
    
    // Notify all clients about the task update
    this.eventsGateway.notifyTaskUpdate(updatedTask);
    
    return updatedTask;
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    
    // Update status
    task.status = status;
    
    const updatedTask = await this.tasksRepository.save(task);
    
    // If task is completed, notify the creator
    if (status === TaskStatus.COMPLETED) {
      this.eventsGateway.notifyTaskCompletion(updatedTask);
    }
    
    // Notify all clients about the task update
    this.eventsGateway.notifyTaskUpdate(updatedTask);
    
    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  async findByCreator(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { creatorId: userId },
    });
  }

  async findByAssignee(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assigneeId: userId },
    });
  }
} 