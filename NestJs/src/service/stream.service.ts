import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import fetch from 'node-fetch';

@Injectable()
export class StreamService implements OnModuleInit {
  private stream: NodeJS.ReadableStream;
  buffer: Buffer;
  reading: boolean;
  contentLength: number;
  bytesWritten: number;
  lengthRegex = /Content-Length:\s*(\d+)/i;
  soi = Buffer.from([0xff, 0xd8]);
  eoi = Buffer.from([0xff, 0xd9]);

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.buffer = null;
    this.reading = false;
    this.contentLength = null;
    this.bytesWritten = 0;
  }

  async onModuleInit() {
    this.initStream();
    console.log('Stream Service started');
  }

  async initStream() {
    const url = this.configService.get('STREAM_URL');
    const response = await fetch(url);
    this.stream = response.body;
    this.stream.pause();
    this.stream.on('data', (data: Buffer) => {
      this.read(data);
    });
  }

  @OnEvent('autoTrackingActivated')
  async streamStart() {
    this.stream.resume();
  }

  @OnEvent('autoTrackingDeactivated')
  async streamStop() {
    this.stream.pause();
  }

  private read(chunk: Buffer) {
    const start = chunk.indexOf(this.soi);
    const end = chunk.indexOf(this.eoi);
    const len = (this.lengthRegex.exec(chunk.toString('ascii')) || [])[1];

    if (this.buffer && (this.reading || start > -1)) {
      this.readFrame(chunk, start, end);
    }

    if (len) {
      this.initFrame(+len, chunk, start, end);
    }
  }

  private initFrame(len: number, chunk: Buffer, start: number, end: number) {
    this.contentLength = len;
    this.buffer = Buffer.alloc(len);
    this.bytesWritten = 0;

    const hasStart = typeof start !== 'undefined' && start > -1;
    const hasEnd = typeof end !== 'undefined' && end > -1 && end > start;

    if (hasStart) {
      let bufEnd = chunk.length;

      if (hasEnd) {
        bufEnd = end + this.eoi.length;
      }

      chunk.copy(this.buffer, 0, start, bufEnd);

      this.bytesWritten = chunk.length - start;
      // If we have the eoi bytes, send the frame
      if (hasEnd) {
        this.sendFrame();
      } else {
        this.reading = true;
      }
    }
  }

  private readFrame(chunk: Buffer, start: number, end: number) {
    const bufStart = start > -1 && start < end ? start : 0;
    const bufEnd = end > -1 ? end + this.eoi.length : chunk.length;

    chunk.copy(this.buffer, this.bytesWritten, bufStart, bufEnd);

    this.bytesWritten += bufEnd - bufStart;

    if (end > -1 || this.bytesWritten === this.contentLength) {
      this.sendFrame();
    } else {
      this.reading = true;
    }
  }

  private sendFrame() {
    this.reading = false;
    this.eventEmitter.emit('onFrameReady', this.buffer);
  }
}
