import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDetector,
  PoseDetector,
  SupportedModels,
} from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-node';
import { createWriteStream } from 'fs';
import { readFile } from 'fs/promises';

@Injectable()
export class TensorFlowService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  private detector: PoseDetector;

  async onModuleInit() {
    this.detector = await createDetector(SupportedModels.MoveNet);
    console.log(`version tensorflow: ${tf.version['tfjs-core']}`);
  }

  async getPose() {
    // await this.downloadImage();

    const imageBuffer = await readFile('temp/pose.jpg');
    const tensor = tf.node.decodeJpeg(imageBuffer);
    return await this.detector.estimatePoses(tensor);
  }

  async downloadImage() {
    // accept jpg only 3 channels not 4 ***
    const response = await this.httpService.axiosRef({
      url: 'jpg',
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(createWriteStream('temp/my.jpg'));
  }
}
