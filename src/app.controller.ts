import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomCacheInterceptor } from './helpers/cacheHeader.interceptor';
import { CacheTTL } from '@nestjs/cache-manager';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Challenge')
@UseInterceptors(CustomCacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @CacheTTL(60 * 60 * 24 * 30)
  @ApiResponse({
    status: 200,
    description: 'Fullstack Challenge 🏅 - Dictionary',
  })
  challenge(): object {
    return this.appService.challenge();
  }
}
