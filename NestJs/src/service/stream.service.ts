import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class StreamService implements OnModuleInit {
  private stream: NodeJS.ReadableStream;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.initStream();
    console.log('Stream Service started');
  }

  async initStream() {
    const SOI = new Uint8Array(2);
    SOI[0] = 0xff;
    SOI[1] = 0xd8;

    const url = this.configService.get('STREAM_URL');
    const response = await fetch(url);
    this.stream = response.body;
    this.stream.pause();
    this.stream.on('data', (data: Uint8Array) => {
      this.read(data);
    });
  }

  async streamStart() {
    this.stream.resume();
  }

  async streamStop() {
    this.stream.pause();
  }

  private read(value: Uint8Array) {
    const TYPE_JPEG = 'image/jpeg';
    const SOI = new Uint8Array(2);
    SOI[0] = 0xff;
    SOI[1] = 0xd8;
    let headers = '';
    let contentLength = -1;
    let imageBuffer = null;
    let bytesRead = 0;

    for (let index = 0; index < value.length; index++) {
      // we've found start of the frame. Everything we've read till now is the header.
      if (value[index] === SOI[0] && value[index + 1] === SOI[1]) {
        // console.log('header found : ' + newHeader);
        contentLength = this.getLength(headers);
        // console.log("Content Length : " + newContentLength);
        imageBuffer = new Uint8Array(new ArrayBuffer(contentLength));
      }
      // we're still reading the header.
      if (contentLength <= 0) {
        headers += String.fromCharCode(value[index]);
      }
      // we're now reading the jpeg.
      else if (bytesRead < contentLength) {
        imageBuffer[bytesRead++] = value[index];
      }
      // we're done reading the jpeg. Time to render it.
      else {
        // console.log("jpeg read with bytes : " + bytesRead);
        const frame = URL.createObjectURL(
          new Blob([imageBuffer], { type: TYPE_JPEG }),
        );
        console.log(frame);
        contentLength = 0;
        bytesRead = 0;
        headers = '';
      }
    }
  }

  private getLength(headers: string) {
    const CONTENT_LENGTH = 'content-length';

    let contentLength = 0;
    headers.split('\n').forEach((header, _) => {
      const pair = header.split(':');
      if (pair[0].toLowerCase() === CONTENT_LENGTH) {
        // Fix for issue https://github.com/aruntj/mjpeg-readable-stream/issues/3 suggested by martapanc
        contentLength = Number(pair[1]);
      }
    });
    return contentLength;
  }
}
