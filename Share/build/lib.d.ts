interface Servo {
    max: number;
    min: number;
    value: number;
    id: string;
}
export declare class WebSocketBase {
    private connection;
    private pitch;
    private yaw;
    private switchIds;
    connectHA(url: string, api: string, autoTrackingEvent: Function, autoShootEvent: Function): Promise<void>;
    moveServoPitch(value: number): Promise<void>;
    moveServoYaw(value: number): Promise<void>;
    subscribeTrackingEvent(autoTrackingEvent: Function): Promise<void>;
    subscribeShootEvent(autoShootEvent: Function): Promise<void>;
    setAutoTracking(state: boolean): Promise<void>;
    setAutoShoot(state: boolean): Promise<void>;
    releaseValve(durationMilliSecond: number): Promise<void>;
    changePumpState(state: boolean): Promise<void>;
    changeValveState(state: boolean): Promise<void>;
    turnOffAllRelays(): Promise<void>;
    callServiceSetNumber(target: Servo): Promise<void>;
    callServiceSwitchOn(switchId: string): Promise<void>;
    callServiceSwitchOff(switchId: string): Promise<void>;
    balancePumpAndValve(): Promise<void>;
    resetServos(): Promise<void>;
    printServoPos(): void;
    private clamp;
}
export {};
//# sourceMappingURL=lib.d.ts.map