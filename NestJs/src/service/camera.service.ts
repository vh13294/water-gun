import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Servo, WebSocketService } from './websocket.service';
import Jimp from 'jimp';
import MjpegDecoder from 'mjpeg-decoder';

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
    const decoder = MjpegDecoder.decoderForSnapshot(url);
    const frame = await decoder.takeSnapshot();
    return await Jimp.read(frame);
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
    return await croppedImg.getBufferAsync(Jimp.MIME_JPEG);
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
    const normalizedPitch = y * CameraService.normalizedImageFactor.pitch;
    const normalizedYaw = x * CameraService.normalizedImageFactor.yaw;
    return {
      pitch: WebSocketService.pitch.max - normalizedPitch,
      yaw: WebSocketService.yaw.max - normalizedYaw,
    };
  }
}
