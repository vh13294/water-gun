import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TensorFlowService } from './tensorflow/tensorflow.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tensorFlowService: TensorFlowService,
  ) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('pose')
  getPose() {
    return this.tensorFlowService.getPose();
  }

  @Get('draw')
  async getPoseAndDraw() {
    await this.tensorFlowService.getPoseAndDraw();
  }
}
