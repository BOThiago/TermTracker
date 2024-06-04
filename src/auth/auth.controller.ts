import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@CacheTTL(0)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() credentials: SignupDto) {
    return await this.authService.signup(credentials);
  }

  @Post('signin')
  async signin(@Body() credentials: SigninDto) {
    return await this.authService.signin(credentials);
  }
}
