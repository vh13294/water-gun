import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDetector,
  Keypoint,
  PoseDetector,
  SupportedModels,
} from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-node';
import { Tensor3D } from '@tensorflow/tfjs-core';

@Injectable()
export class TensorFlowService implements OnModuleInit {
  private detector: PoseDetector;

  async onModuleInit() {
    try {
      this.detector = await createDetector(SupportedModels.MoveNet);
      console.log('TensorFlow Service Started');
    } catch (error) {
      console.log(error);
    }
  }

  // todo temporary fix
  async getPose(imageBuffer: Uint8Array) {
    const tensor = tf.node.decodeJpeg(imageBuffer);
    const pose = await this.detector.estimatePoses(
      tensor as unknown as Tensor3D,
    );
    tensor.dispose();
    return pose[0]?.keypoints;
  }

  getSpecificKeyPoint(bodyPart: string, keypoints: Keypoint[]) {
    return keypoints.filter((keyPoint) => keyPoint.name === bodyPart)[0];
  }
}
