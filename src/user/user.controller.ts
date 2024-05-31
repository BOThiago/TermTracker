import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthenticatedRequest } from '../auth/interface/auth.interface';

@Controller('user/me')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user['userId'];
    return this.userService.getUserProfile(userId);
  }

  @Get('history')
  async getHistory(@Req() req: AuthenticatedRequest) {
    const userId = req.user['userId'];
    return this.userService.getUserHistory(userId);
  }

  @Get('favorites')
  async getFavorites(@Req() req: AuthenticatedRequest) {
    const userId = req.user['userId'];
    return this.userService.getUserFavorites(userId);
  }
}
