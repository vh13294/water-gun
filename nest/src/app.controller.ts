import { Controller, Get } from '@nestjs/common';
import { TensorFlowService } from './service/tensorflow.service';
import { WebSocketService } from './service/websocket.service';

@Controller()
export class AppController {
  constructor(
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
  ) {}

  @Get()
  async getHello() {
    return 'Hello';
  }

  @Get('pose')
  getPose() {
    return this.tensorFlowService.getPose();
  }

  @Get('draw')
  async getPoseAndDraw() {
    await this.tensorFlowService.getPoseAndDraw();
  }

  @Get('move')
  getMove() {
    return this.webSocketService.moveServoPitch(20);
  }
}
