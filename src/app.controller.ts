import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomCacheInterceptor } from './helpers/cacheHeader.interceptor';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CustomCacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @CacheTTL(60 * 60 * 24 * 30)
  challenge(): object {
    return this.appService.challenge();
  }
}
