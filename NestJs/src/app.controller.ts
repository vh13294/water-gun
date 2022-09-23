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

  @Get('shoot')
  shoot() {
    return this.taskService.detectPoseAndShoot();
  }

  @Get('snapshot')
  snapshot() {
    return this.taskService.takeSnapShot();
  }
}
