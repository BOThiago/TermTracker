import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UsuarioIdParam } from '../helpers/params-decorators.helper';

@Controller('user/me')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getProfile(@UsuarioIdParam('userId') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Get('history')
  async getHistory(@UsuarioIdParam('userId') userId: string) {
    return this.userService.getUserHistory(userId);
  }

  @Get('favorites')
  async getFavorites(@UsuarioIdParam('userId') userId: string) {
    return this.userService.getUserFavorites(userId);
  }
}
