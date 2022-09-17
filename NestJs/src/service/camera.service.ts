import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Servo, WebSocketService } from './websocket.service';
import Jimp from 'jimp';

// interface

@Injectable()
export class CameraService implements OnModuleInit {
  private static normalizedImageFactor: { pitch: number; yaw: number };

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    CameraService.normalizedImageFactor = this.getNormalizeImageFactor(
      WebSocketService.pitch,
      WebSocketService.yaw,
    );
    console.log('Camera Service started');
  }

  async downloadTest(url: string) {
    const img = await Jimp.read(url);
    const croppedImg = this.cropImage(img);
    return croppedImg.getBufferAsync(Jimp.MIME_JPEG);
  }

  async downloadImage() {
    const url = this.configService.get('SNAP_SHOT_URL');
    return await Jimp.read(url);
  }

  cropImage(img: Jimp) {
    const x = Number(this.configService.get('CROP_IMAGE_X'));
    const y = Number(this.configService.get('CROP_IMAGE_Y'));
    const w = Number(this.configService.get('CROP_IMAGE_W'));
    const h = Number(this.configService.get('CROP_IMAGE_H'));
    return img.crop(x, y, w, h);
  }

  async downloadAndCropImage() {
    const img = await this.downloadImage();
    const croppedImg = this.cropImage(img);
    return croppedImg.getBufferAsync(Jimp.MIME_JPEG);
  }

  getNormalizeImageFactor(pitch: Servo, yaw: Servo) {
    const pitchRange = pitch.max - pitch.min;
    const yawRange = yaw.max - yaw.min;

    const w = Number(this.configService.get('CROP_IMAGE_W'));
    const h = Number(this.configService.get('CROP_IMAGE_H'));

    return {
      pitch: pitchRange / h,
      yaw: yawRange / w,
    };
  }

  getServoValuesFromImagePoint(x: number, y: number) {
    return {
      pitch: x * CameraService.normalizedImageFactor.pitch,
      yaw: y * CameraService.normalizedImageFactor.yaw,
    };
  }
}