import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDetector,
  Pose,
  PoseDetector,
  SupportedModels,
} from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-node';
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';

@Injectable()
export class TensorFlowService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  private detector: PoseDetector;
  async onModuleInit() {
    this.detector = await createDetector(SupportedModels.MoveNet);
    console.log(`version tensorflow: ${tf.version['tfjs-core']}`);
  }

  async getPose() {
    const image = await this.downloadImage();
    const tensor = tf.node.decodeJpeg(image.intArr);
    return await this.detector.estimatePoses(tensor);
  }

  async getPoseAndDraw() {
    const image = await this.downloadImage();
    const tensor = tf.node.decodeJpeg(image.intArr);
    const pose = await this.detector.estimatePoses(tensor);
    await this.canvasDraw(pose[0], image.buffer);
  }

  private async downloadImage() {
    // accept jpg only 3 channels not 4 ***
    const response = await this.httpService.axiosRef({
      url: 'https://img.freepik.com/premium-photo/group-diverse-friends-taking-selfie-beach_53876-91925.jpg?w=2000',
      method: 'GET',
      responseType: 'arraybuffer',
    });

    return {
      buffer: response.data,
      intArr: new Uint8Array(response.data),
    };
  }

  private async canvasDraw(pose: Pose, buffer: Buffer) {
    const image = await loadImage(buffer);

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(200, 0, 0, 0.5)';
    pose.keypoints.forEach((element) => {
      context.fillRect(element.x, element.y, 50, 50);
    });

    await writeFile('public/output.jpg', canvas.toBuffer());
  }
}
