import { SupportedModels, createDetector } from "@tensorflow-models/pose-detection";
import '@tensorflow/tfjs-backend-webgl';

class TensorFlow {
    constructor() {
        this.init()
    }

    async init() {
        this.detector = await createDetector(SupportedModels.MoveNet);
        console.log('tensor flow initialized');
    }

    /**
     * @param {import("@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces").PixelInput} image
     */
    async getPose(image) {
        return await this.detector.estimatePoses(image);
    }
}

const tensorFlow = new TensorFlow();

export default tensorFlow