import { Controller, Post, Get, Body, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //post request
  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.signup(email, password);
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  @Get('login')
  login(@Res() res: Response) {
    this.authService.redirectToFusionAuthLoginPage(res);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokenResponse = await this.authService.exchangeCodeForToken(code);
    if (tokenResponse.access_token) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/login?error=failed_to_exchange_token');
    }
  }
}
