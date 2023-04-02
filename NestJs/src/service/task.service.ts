import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';
import Jimp from 'jimp';
import { ConfigService } from '@nestjs/config';
import { Keypoint } from '@tensorflow-models/pose-detection';

@Injectable()
export class TaskService {
  constructor(private configService: ConfigService) {}

  async takeSnapShot(buffer: Buffer) {
    // const url =
    //   this.configService.get('BASE_URL') +
    //   this.configService.get('SNAP_SHOT_URL');
    const imageBuffer = await Jimp.read(buffer);
    const jimpImg = await imageBuffer.getBufferAsync(Jimp.MIME_JPEG);
    this.canvasDraw([], jimpImg);
  }

  async canvasDraw(keypoints: Keypoint[], buffer: Buffer, filename = '') {
    const image = await loadImage(buffer);

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(200, 0, 0, 0.5)';

    keypoints.forEach((element) => {
      context.fillRect(element.x, element.y, 50, 50);
    });

    // await writeFile('public/output.jpg', canvas.toBuffer());
    await writeFile(`public/${filename}-temp.jpg`, canvas.toBuffer());
  }
}
