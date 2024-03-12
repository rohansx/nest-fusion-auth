import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService], // Register AuthService as a provider
  controllers: [AuthController], // Register AuthController
})
export class AuthModule {}
