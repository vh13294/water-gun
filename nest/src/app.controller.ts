import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { TensorFlowService } from './tensorflow/tensorflow.service';
import { Response } from 'express';

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

  @Get('tensor')
  getTensor() {
    return this.tensorFlowService.getPose();
  }

  @Get('test')
  getTest() {
    return this.tensorFlowService.downloadImage();
  }

  // @Get('test')
  // async getImg(@Res() response: Response) {
  //   const responseImg = await this.tensorFlowService.downloadImage();
  //   const img = Buffer.from(responseImg.data, 'binary').toString('base64');
  //   const base64 =
  //     'data:' + responseImg.headers['content-type'] + ';base64,' + img;

  //   response.writeHead(200, {
  //     'Content-Type': 'image/png',
  //   });
  //   response.end(base64);
  // }
}
