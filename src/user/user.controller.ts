import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UsuarioIdParam } from '../helpers/params-decorators.helper';
import { CustomCacheInterceptor } from '../helpers/cacheHeader.interceptor';

@Controller('user/me')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCacheInterceptor)
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
