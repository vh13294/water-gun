import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CameraService } from './camera.service';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';
import { Keypoint } from '@tensorflow-models/pose-detection';
import Jimp from 'jimp';

@Injectable()
export class TaskService {
  static isAutoMode = false;
  private static isProcessing = false;

  constructor(
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
    private readonly cameraService: CameraService,
  ) {}

  @Interval(10000)
  async handleInterval() {
    // console.log('Called every 10 seconds');
    if (TaskService.isAutoMode) {
      if (!TaskService.isProcessing) {
        TaskService.isProcessing = true;
        console.log('processing!');
        try {
          await this.detectPoseAndShoot();
        } catch (error) {
          console.log(error);
        } finally {
          TaskService.isProcessing = false;
        }
      } else {
        console.warn('Detection process not yet complete');
      }
    }
  }

  async detectPoseAndShootTest(fileId: string) {
    try {
      console.time('water jet');
      const imageBuffer = await this.cameraService.downloadTest(
        `public/${fileId}.jpg`,
      );
      console.log('image downloaded');
      const keypoints = await this.tensorFlowService.getPose(imageBuffer);
      if (keypoints) {
        console.log('pos detected');
        this.canvasDraw(keypoints, imageBuffer);
        const nosePoint = this.tensorFlowService.getSpecificKeyPoint(
          'nose',
          keypoints,
        );
        await this.moveToTargetAndOpenValve(nosePoint);
      }
      console.timeEnd('water jet');
    } catch (error) {
      console.log(error);
    }
  }

  async detectPoseAndShoot() {
    const imageBuffer = await this.cameraService.downloadAndCropImage();
    const keypoints = await this.tensorFlowService.getPose(imageBuffer);
    if (keypoints) {
      const nosePoint = this.tensorFlowService.getSpecificKeyPoint(
        'nose',
        keypoints,
      );
      await this.moveToTargetAndOpenValve(nosePoint);
    }
  }

  async moveToTargetAndOpenValve(nosePoint: Keypoint) {
    const servos = this.cameraService.getServoValuesFromImagePoint(
      nosePoint.x,
      nosePoint.y,
    );
    await this.webSocketService.moveServos(servos.yaw, servos.pitch);
    await this.webSocketService.releaseWaterValve(3000);
    await this.webSocketService.resetServos();
  }

  setAutoMode(bool: boolean) {
    TaskService.isAutoMode = bool;
  }

  async takeSnapShot() {
    const imageBuffer = await this.cameraService.downloadImage();
    const jimpImg = await imageBuffer.getBufferAsync(Jimp.MIME_JPEG);
    this.canvasDraw([], jimpImg);
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
