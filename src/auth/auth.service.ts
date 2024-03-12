import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async signup(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.configService.get<string>('FUSIONAUTH_BASE_URL')}/api/user/registration`,
        {
          user: { email, password },
          registration: {
            applicationId: this.configService.get<string>(
              'FUSIONAUTH_APPLICATION_ID',
            ),
          },
        },
        {
          headers: {
            Authorization: this.configService.get<string>('FUSIONAUTH_API_KEY'),
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to register user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  redirectToFusionAuthLoginPage(res: Response) {
    const clientId = this.configService.get<string>(
      'FUSIONAUTH_APPLICATION_ID',
    );
    const redirectUri = 'http://localhost:3000/auth/callback';
    const loginUrl = `${this.configService.get<string>('FUSIONAUTH_BASE_URL')}/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
    res.redirect(loginUrl);
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.configService.get<string>('FUSIONAUTH_BASE_URL')}/oauth2/token`,
        {
          client_id: this.configService.get<string>(
            'FUSIONAUTH_APPLICATION_ID',
          ),
          client_secret: this.configService.get<string>(
            'FUSIONAUTH_CLIENT_SECRET',
          ), // Ensure you've added FUSIONAUTH_CLIENT_SECRET to your .env
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3000/auth/callback',
        },
      );
      return response.data;
    } catch (error) {
      console.error('Failed to exchange code for token:', error);
      return null; // Or handle the error as appropriate for your application
    }
  }
}
