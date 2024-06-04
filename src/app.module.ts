import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WordService } from './word/word.service';
import { WordModule } from './word/word.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomCacheInterceptor } from './helpers/cacheHeader.interceptor';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DATABASE_HOST')}:${configService.get('DATABASE_PORT')}`,
        dbName: `${configService.get('DATABASE_NAME')}`,
        autoCreate: true,
        auth: {
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASS'),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      useFactory: async (configService: ConfigService) => ({
        ttl: 60,
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    AuthModule,
    UserModule,
    WordModule,
  ],
  controllers: [AppController],
  providers: [
    WordService,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly wordsService: WordService) {}

  onModuleInit() {
    this.wordsService.getAllWords();
  }
}
