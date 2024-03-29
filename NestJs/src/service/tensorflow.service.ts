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
    try {
      this.detector = await createDetector(SupportedModels.MoveNet);
      console.log('TensorFlow Service Started');
    } catch (error) {
      console.log(error);
    }
  }

  // estimate Poses only return single pose
  async getPose(imageBuffer: Uint8Array) {
    const tensor = tf.node.decodeJpeg(imageBuffer);
    const pose = await this.detector.estimatePoses(tensor);
    tensor.dispose();
    return pose[0];
  }

  getSpecificKeyPoint(bodyPart: string, keypoints: Keypoint[]) {
    return keypoints.filter((keyPoint) => keyPoint.name === bodyPart)[0];
  }
}
