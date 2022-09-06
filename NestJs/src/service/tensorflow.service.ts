import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDetector,
  Keypoint,
  PoseDetector,
  SupportedModels,
} from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-node';
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';
import { CameraService } from './camera.service';

@Injectable()
export class TensorFlowService implements OnModuleInit {
  constructor(private readonly cameraService: CameraService) {}

  private detector: PoseDetector;

  async onModuleInit() {
    this.detector = await createDetector(SupportedModels.MoveNet);
    console.log('TensorFlow Service Started');
  }

  async getPose(drawToFile = false) {
    const image = await this.downloadImage();
    const tensor = tf.node.decodeJpeg(image.intArr);
    const pose = await this.detector.estimatePoses(tensor);
    if (drawToFile) {
      this.canvasDraw(pose[0].keypoints, image.buffer);
    }
    return pose;
  }

  private async downloadImage() {
    const imageBuffer = await this.cameraService.downloadAndCropImage();
    return {
      buffer: imageBuffer,
      intArr: new Uint8Array(imageBuffer),
    };
  }

  private async canvasDraw(keypoints: Keypoint[], buffer: Buffer) {
    const image = await loadImage(buffer);

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(200, 0, 0, 0.5)';

    keypoints.forEach((element) => {
      context.fillRect(element.x, element.y, 50, 50);
    });

    await writeFile('public/output.jpg', canvas.toBuffer());
  }
}
