import { Controller, Get } from '@nestjs/common';
import { TaskService } from './service/task.service';

@Controller()
export class AppController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getHello() {
    return 'Hello';
  }

  @Get('test')
  getTest() {
    return this.taskService.detectPoseAndShootTest();
  }

  @Get('setAutoMode')
  getSetAutoMode() {
    return this.taskService.setAutoMode(true);
  }
}
