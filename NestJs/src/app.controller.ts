import { Body, Controller, Get, Post } from '@nestjs/common';
import { SshService } from './service/ssh.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class AppController {
  constructor(
    private sshService: SshService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('shutdown')
  async sendShutdownCommand() {
    this.sshService.shutdownServer();
  }

  @Get('reboot')
  async sendRebootCommand() {
    this.sshService.rebootServer();
  }

  @Post('auto-tracking')
  async autoTracking(@Body('state') state: boolean) {
    if (state) {
      this.eventEmitter.emit('autoTrackingActivated');
    } else {
      this.eventEmitter.emit('autoTrackingDeactivated');
    }
  }

  // If valve is broken, we can still shooting by open/close pump
  @Post('auto-shoot')
  async autoShoot(
    @Body('state') state: boolean,
    @Body('mode') mode: 'valve' | 'pump',
  ) {
    switch (mode) {
      case 'valve':
        this.eventEmitter.emit('autoShootViaValve', { state: state });
        break;
      case 'pump':
        this.eventEmitter.emit('autoShootViaPump', { state: state });
        break;
    }
  }
}
