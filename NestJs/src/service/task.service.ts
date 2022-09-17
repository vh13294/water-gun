import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CameraService } from './camera.service';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';
import { setTimeout } from 'timers/promises';
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';
import { Keypoint } from '@tensorflow-models/pose-detection';

@Injectable()
export class TaskService {
  private static isAutoMode = false;
  private static isProcessing = false;

  constructor(
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
    private readonly cameraService: CameraService,
  ) {}

  @Interval(10000)
  async handleInterval() {
    console.log('Called every 10 seconds');
    if (TaskService.isAutoMode && !TaskService.isProcessing) {
      TaskService.isProcessing = true;
      try {
        this.detectPoseAndShoot();
      } catch (error) {
        console.log(error);
      } finally {
        TaskService.isProcessing = false;
      }
    }
  }

  async detectPoseAndShootTest() {
    try {
      for (let i = 1; i < 10; i++) {
        const imageBuffer = await this.cameraService.downloadTest(
          `public/${i}.jpg`,
        );
        const keypoints = await this.tensorFlowService.getPose(imageBuffer);
        if (keypoints) {
          this.canvasDraw(keypoints, imageBuffer);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async detectPoseAndShoot() {
    const imageBuffer = await this.cameraService.downloadAndCropImage();
    const keypoints = await this.tensorFlowService.getPose(imageBuffer);
    if (keypoints) {
      const nosePoint = this.tensorFlowService.getSpecificKeyPoint(
        'nose',
        keypoints,
      );
      console.log(nosePoint);

      const servos = this.cameraService.getServoValuesFromImagePoint(
        nosePoint.x,
        nosePoint.y,
      );
      this.webSocketService.moveServoPitch(servos.pitch);
      this.webSocketService.moveServoYaw(servos.yaw);

      // wait for servos to move to position
      await setTimeout(500);

      // open water valve,

      // open valve for 1.5s
      await setTimeout(1500);

      // close water valve

      this.webSocketService.resetServos();
    }
  }

  setAutoMode(bool: boolean) {
    TaskService.isAutoMode = bool;
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
