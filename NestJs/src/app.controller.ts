import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './service/task.service';

@Controller()
export class AppController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getHello() {
    return 'Hello';
  }

  @Get('test/:id')
  getTest(@Param('id') id: string) {
    return this.taskService.detectPoseAndShootTest(id);
  }

  @Get('setAutoModeOn')
  getSetAutoModeOn() {
    return this.taskService.setAutoMode(true);
  }

  @Get('setAutoModeOff')
  getSetAutoModeOff() {
    return this.taskService.setAutoMode(false);
  }
}
