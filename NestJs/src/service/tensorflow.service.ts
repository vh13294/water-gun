import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDetector,
  Keypoint,
  PoseDetector,
  SupportedModels,
} from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class TensorFlowService implements OnModuleInit {
  private detector: PoseDetector;

  async onModuleInit() {
    this.detector = await createDetector(SupportedModels.MoveNet);
    console.log('TensorFlow Service Started');
  }

  async getPose(imageBuffer: Buffer) {
    const tensor = tf.node.decodeJpeg(new Uint8Array(imageBuffer));
    const pose = await this.detector.estimatePoses(tensor);
    return pose[0]?.keypoints;
  }

  getSpecificKeyPoint(bodyPart: string, keypoints: Keypoint[]) {
    return keypoints.filter((keyPoint) => keyPoint.name === bodyPart)[0];
  }
}
