import { Controller, Get } from '@nestjs/common';
import { SshService } from './service/ssh.service';

@Controller()
export class AppController {
  constructor(private sshService: SshService) {}

  @Get('shutdown')
  async sendShutdownCommand() {
    this.sshService.shutdownServer();
  }

  @Get('reboot')
  async sendRebootCommand() {
    this.sshService.rebootServer();
  }
}
