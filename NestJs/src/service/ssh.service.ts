import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSSH } from 'node-ssh';

@Injectable()
export class SshService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  private ssh = new NodeSSH();
  private url: string;
  private username: string;
  private password: string;

  async onModuleInit() {
    this.initConfigs();
    await this.connectToServer();
    console.log('SSH Service started');
  }

  initConfigs() {
    // this.url = this.configService.get('BASE_URL');
    this.url = 'localhost';
    this.username = this.configService.get('SERVER_USERNAME');
    this.password = this.configService.get('SERVER_PASSWORD');
  }

  async connectToServer() {
    await this.ssh.connect({
      host: this.url,
      port: 22,
      username: this.username,
      password: this.password,
    });
  }

  async shutdownServer() {
    this.ssh
      .execCommand(`ssh -t ${this.username}@${this.url} 'sudo shutdown -h now'`)
      .then((result) => {
        console.log('STDOUT: ' + result.stdout);
        console.log('STDERR: ' + result.stderr);
      });
  }

  async rebootServer() {
    this.ssh
      .execCommand(`ssh -t ${this.username}@${this.url} 'sudo shutdown -r now'`)
      .then((result) => {
        console.log('STDOUT: ' + result.stdout);
        console.log('STDERR: ' + result.stderr);
      });
  }
}
