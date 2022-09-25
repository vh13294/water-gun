import { Controller, Get } from '@nestjs/common';
import { StreamService } from './service/stream.service';
import { TaskService } from './service/task.service';

@Controller()
export class AppController {
  constructor(
    private readonly streamService: StreamService,
    private readonly taskService: TaskService,
  ) {}

  @Get()
  async getHello() {
    return 'Hello';
  }

  @Get('start')
  async start() {
    this.streamService.streamStart();
  }

  @Get('stop')
  async stop() {
    this.streamService.streamStop();
  }

  // @Get('snapshot')
  // snapshot() {
  //   return this.taskService.takeSnapShot();
  // }
}
