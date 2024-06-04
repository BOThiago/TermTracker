import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UsuarioIdParam } from '../helpers/params-decorators.helper';
import { CustomCacheInterceptor } from '../helpers/cacheHeader.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCacheInterceptor)
@CacheTTL(0)
@Controller('user/me')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@UsuarioIdParam('userId') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user history' })
  @ApiResponse({
    status: 200,
    description: 'User history retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHistory(@UsuarioIdParam('userId') userId: string) {
    return this.userService.getUserHistory(userId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({
    status: 200,
    description: 'User favorites retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFavorites(@UsuarioIdParam('userId') userId: string) {
    return this.userService.getUserFavorites(userId);
  }
}
