import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@CacheTTL(0)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async signup(@Body() credentials: SignupDto) {
    return await this.authService.signup(credentials);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signin(@Body() credentials: SigninDto) {
    return await this.authService.signin(credentials);
  }
}
