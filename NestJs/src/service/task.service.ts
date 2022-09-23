import { Injectable } from '@nestjs/common';
import { CameraService } from './camera.service';
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';
import Jimp from 'jimp';
import { ConfigService } from '@nestjs/config';
import { Keypoint } from '@tensorflow-models/pose-detection';

@Injectable()
export class TaskService {
  constructor(
    private readonly cameraService: CameraService,
    private configService: ConfigService,
  ) {}

  async takeSnapShot() {
    const url = this.configService.get('SNAP_SHOT_URL');
    const imageBuffer = await Jimp.read(url);
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
