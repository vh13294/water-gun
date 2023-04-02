import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';

@Injectable()
export class SshService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  private url: string;
  private username: string;
  private password: string;

  async onModuleInit() {
    this.initConfigs();
    console.log('SSH Service started');
  }

  initConfigs() {
    // this.url = 192.168.20.12;
    this.url = 'localhost';
    this.username = this.configService.get('SERVER_USERNAME');
    this.password = this.configService.get('SERVER_PASSWORD');
  }

  async shutdownServer() {
    exec(
      `sshpass -p ${this.password} ssh -tt ${this.username}@${this.url} -o StrictHostKeyChecking=no 'sudo shutdown -h now'`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      },
    );
  }

  async rebootServer() {
    exec(
      `sshpass -p ${this.password} ssh -tt ${this.username}@${this.url} -o StrictHostKeyChecking=no 'sudo shutdown -r now'`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      },
    );
  }
}
